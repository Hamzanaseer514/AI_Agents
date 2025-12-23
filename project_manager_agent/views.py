from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
from datetime import datetime, timedelta

from core.models import Project, Task, TeamMember, UserProfile
from .ai_agents import AgentRegistry


@login_required
def ai_agents_test(request):
    """Main page for testing AI agents - Only accessible to Project Managers"""
    # For admin users, check session role; otherwise check profile role
    if request.user.is_superuser or request.user.is_staff:
        selected_role = request.session.get('selected_role')
        if selected_role != 'project_manager':
            from django.contrib import messages
            messages.error(request, 'Access denied. Please select "Project Manager" role to access this dashboard.')
            return redirect('select_role')
    else:
        # Check if user is a project manager
        try:
            profile = request.user.profile
            if not profile.is_project_manager():
                from django.contrib import messages
                messages.error(request, 'Access denied. This dashboard is only available to Project Managers.')
                return redirect('dashboard')
        except UserProfile.DoesNotExist:
            from django.contrib import messages
            messages.error(request, 'Access denied. Please complete your profile setup.')
            return redirect('dashboard')
    
    projects = Project.objects.filter(owner=request.user)
    tasks = Task.objects.filter(project__owner=request.user)
    return render(request, 'project_manager_template/ai_agents_test.html', {
        'projects': projects,
        'tasks': tasks,
        'agents': AgentRegistry.list_agents()
    })


@login_required
@require_http_methods(["POST"])
def test_task_prioritization(request):
    """Test Task Prioritization Agent"""
    try:
        agent = AgentRegistry.get_agent("task_prioritization")
        data = json.loads(request.body)
        action = data.get('action', 'prioritize')
        
        # Get tasks from database
        project_id = data.get('project_id')
        if project_id:
            tasks_queryset = Task.objects.filter(project_id=project_id, project__owner=request.user)
        else:
            tasks_queryset = Task.objects.filter(project__owner=request.user)
        
        # Convert to dict format
        tasks = []
        for task in tasks_queryset:
            tasks.append({
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'status': task.status,
                'priority': task.priority,
                'due_date': task.due_date.isoformat() if task.due_date else None,
                'assignee_id': task.assignee.id if task.assignee else None,
                'dependencies': list(task.depends_on.values_list('id', flat=True))
            })
        
        # Get team members if needed
        team_members = []
        if action in ['bottlenecks', 'delegation']:
            if project_id:
                members = TeamMember.objects.filter(project_id=project_id)
            else:
                members = TeamMember.objects.filter(project__owner=request.user)
            
            for member in members:
                team_members.append({
                    'id': member.user.id,
                    'name': member.user.username,
                    'role': member.role
                })
        
        # Process with agent
        result = agent.process(
            action=action,
            tasks=tasks,
            team_members=team_members,
            task=data.get('task', {})
        )
        
        return JsonResponse(result)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@login_required
@require_http_methods(["POST"])
def test_knowledge_qa(request):
    """Test Knowledge Q&A Agent"""
    try:
        agent = AgentRegistry.get_agent("knowledge_qa")
        data = json.loads(request.body)
        question = data.get('question', '')
        
        # Always get all user's projects for context
        all_projects = Project.objects.filter(owner=request.user)
        all_tasks = Task.objects.filter(project__owner=request.user)
        
        # Get project context if specific project provided
        project_id = data.get('project_id')
        context = {}
        project = None
        
        if project_id:
            project = get_object_or_404(Project, id=project_id, owner=request.user)
            tasks = Task.objects.filter(project=project)
            context = {
                'project': {
                    'id': project.id,
                    'name': project.name,
                    'status': project.status,
                    'tasks_count': tasks.count()
                },
                'tasks': [{'title': t.title, 'status': t.status, 'priority': t.priority} for t in tasks[:10]],
                # Always include all projects list
                'all_projects': [
                    {
                        'id': p.id,
                        'name': p.name,
                        'status': p.status,
                        'priority': p.priority,
                        'tasks_count': p.tasks.count(),
                        'description': p.description[:100] if p.description else ''
                    }
                    for p in all_projects
                ]
            }
        else:
            # Get all user's projects for context
            context = {
                'all_projects': [
                    {
                        'id': p.id,
                        'name': p.name,
                        'status': p.status,
                        'priority': p.priority,
                        'tasks_count': p.tasks.count(),
                        'description': p.description[:100] if p.description else ''
                    }
                    for p in all_projects
                ],
                'tasks': [{'title': t.title, 'status': t.status, 'priority': t.priority, 'project_name': t.project.name} for t in all_tasks[:10]]
            }
        
        # Get available users (all users in the system, or team members if project specified)
        available_users = []
        if project_id:
            # Get team members for the project
            team_members = TeamMember.objects.filter(project_id=project_id)
            for member in team_members:
                available_users.append({
                    'id': member.user.id,
                    'username': member.user.username,
                    'name': member.user.get_full_name() or member.user.username,
                    'role': member.role
                })
            # Also include project owner
            if project.owner not in [m.user for m in team_members]:
                available_users.append({
                    'id': project.owner.id,
                    'username': project.owner.username,
                    'name': project.owner.get_full_name() or project.owner.username,
                    'role': 'owner'
                })
        else:
            # Get all users (for general queries)
            from django.contrib.auth import get_user_model
            User = get_user_model()
            users = User.objects.all()[:20]  # Limit to 20 users
            for user in users:
                available_users.append({
                    'id': user.id,
                    'username': user.username,
                    'name': user.get_full_name() or user.username
                })
        
        # Process with agent
        result = agent.process(question=question, context=context, available_users=available_users)
        
        # Check if agent said it cannot do something - don't execute any actions
        if result.get('cannot_do'):
            # Agent cannot perform the requested action - just return the explanation
            return JsonResponse(result)
        
        # Handle multiple actions (e.g., create project + tasks)
        actions = result.get('actions', [])
        if result.get('action'):
            # Single action (backward compatibility)
            actions = [result['action']]
        
        # Only execute actions if we have valid actions and agent didn't say it can't do it
        if actions and not result.get('cannot_do'):
            from datetime import datetime, timedelta
            
            created_project_id = None
            action_results = []
            
            for action_data in actions:
                action_type = action_data.get('action')
                
                # Handle project creation
                if action_type == 'create_project':
                    try:
                        # Calculate end date if deadline is mentioned
                        end_date = None
                        deadline_days = action_data.get('deadline_days')
                        if deadline_days:
                            try:
                                days = int(str(deadline_days).replace('working days', '').replace('days', '').strip())
                                # Calculate working days (excluding weekends)
                                current_date = datetime.now().date()
                                working_days = 0
                                check_date = current_date
                                while working_days < days:
                                    if check_date.weekday() < 5:  # Monday to Friday
                                        working_days += 1
                                    if working_days < days:
                                        check_date += timedelta(days=1)
                                end_date = check_date
                            except (ValueError, TypeError):
                                pass
                        
                        project = Project.objects.create(
                            name=action_data.get('project_name', 'New Project'),
                            description=action_data.get('project_description', ''),
                            owner=request.user,
                            status=action_data.get('project_status', 'planning'),
                            priority=action_data.get('project_priority', 'medium'),
                            end_date=end_date
                        )
                        
                        created_project_id = project.id
                        action_results.append({
                            'action': 'create_project',
                            'success': True,
                            'project_id': project.id,
                            'project_name': project.name,
                            'message': f'Project "{project.name}" created successfully!'
                        })
                        
                        result['answer'] += f"\n\n✅ **Project Created Successfully!**\n- Project: {project.name}\n- Status: {project.get_status_display()}\n- Priority: {project.get_priority_display()}"
                        if end_date:
                            result['answer'] += f"\n- Deadline: {end_date.strftime('%B %d, %Y')}"
                            
                    except Exception as e:
                        action_results.append({
                            'action': 'create_project',
                            'success': False,
                            'error': str(e)
                        })
                
                # Handle task creation
                elif action_type == 'create_task':
                    try:
                        # Get or determine project
                        task_project_id = action_data.get('project_id')
                        
                        # Use newly created project if this task is for it
                        if not task_project_id and created_project_id:
                            task_project_id = created_project_id
                        elif not task_project_id and project_id:
                            task_project_id = project_id
                        elif not task_project_id and context.get('project'):
                            task_project_id = context['project']['id']
                        elif not task_project_id and context.get('all_projects') and len(context.get('all_projects', [])) > 0:
                            # Use first project if multiple
                            task_project_id = context['all_projects'][0]['id']
                        
                        if not task_project_id:
                            action_results.append({
                                'action': 'create_task',
                                'success': False,
                                'error': f"Could not determine which project to create task '{action_data.get('task_title', 'Unknown')}' in."
                            })
                        else:
                            # Verify project ownership
                            task_project = get_object_or_404(Project, id=task_project_id, owner=request.user)
                            
                            # Create the task
                            task = Task.objects.create(
                                title=action_data.get('task_title', 'New Task'),
                                description=action_data.get('task_description', ''),
                                project=task_project,
                                status=action_data.get('status', 'todo'),
                                priority=action_data.get('priority', 'medium'),
                                assignee_id=action_data.get('assignee_id') if action_data.get('assignee_id') else None
                            )
                            
                            action_results.append({
                                'action': 'create_task',
                                'success': True,
                                'task_id': task.id,
                                'task_title': task.title,
                                'project_name': task_project.name,
                                'message': f'Task "{task.title}" created successfully!'
                            })
                            
                            result['answer'] += f"\n\n✅ **Task Created: {task.title}**\n- Project: {task_project.name}\n- Status: {task.get_status_display()}\n- Priority: {task.get_priority_display()}"
                            if task.assignee:
                                result['answer'] += f"\n- Assigned to: {task.assignee.username}"
                    except Exception as e:
                        action_results.append({
                            'action': 'create_task',
                            'success': False,
                            'error': f"Error creating task: {str(e)}"
                        })
            
            # Store all action results
            result['action_results'] = action_results
            result['actions'] = actions
        
        return JsonResponse(result)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@login_required
@require_http_methods(["POST"])
def test_project_pilot(request):
    """Test Project Pilot Agent"""
    try:
        agent = AgentRegistry.get_agent("project_pilot")
        data = json.loads(request.body)
        question = data.get('question', '')
        
        # Always get all user's projects for context
        all_projects = Project.objects.filter(owner=request.user)
        all_tasks = Task.objects.filter(project__owner=request.user)
        
        # Get project context if specific project provided
        project_id = data.get('project_id')
        context = {}
        project = None
        
        if project_id:
            project = get_object_or_404(Project, id=project_id, owner=request.user)
            tasks = Task.objects.filter(project=project)
            context = {
                'project': {
                    'id': project.id,
                    'name': project.name,
                    'status': project.status,
                    'tasks_count': tasks.count()
                },
                'tasks': [{'title': t.title, 'status': t.status, 'priority': t.priority} for t in tasks[:10]],
                'all_projects': [
                    {
                        'id': p.id,
                        'name': p.name,
                        'status': p.status,
                        'priority': p.priority,
                        'tasks_count': p.tasks.count(),
                        'description': p.description[:100] if p.description else ''
                    }
                    for p in all_projects
                ]
            }
        else:
            context = {
                'all_projects': [
                    {
                        'id': p.id,
                        'name': p.name,
                        'status': p.status,
                        'priority': p.priority,
                        'tasks_count': p.tasks.count(),
                        'description': p.description[:100] if p.description else ''
                    }
                    for p in all_projects
                ],
                'tasks': [{'title': t.title, 'status': t.status, 'priority': t.priority, 'project_name': t.project.name} for t in all_tasks[:10]]
            }
        
        # Get available users
        available_users = []
        if project_id:
            team_members = TeamMember.objects.filter(project_id=project_id)
            for member in team_members:
                available_users.append({
                    'id': member.user.id,
                    'username': member.user.username,
                    'name': member.user.get_full_name() or member.user.username,
                    'role': member.role
                })
            if project.owner not in [m.user for m in team_members]:
                available_users.append({
                    'id': project.owner.id,
                    'username': project.owner.username,
                    'name': project.owner.get_full_name() or project.owner.username,
                    'role': 'owner'
                })
        else:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            users = User.objects.all()[:20]
            for user in users:
                available_users.append({
                    'id': user.id,
                    'username': user.username,
                    'name': user.get_full_name() or user.username
                })
        
        # Process with agent
        result = agent.process(question=question, context=context, available_users=available_users)
        
        if result.get('cannot_do'):
            return JsonResponse(result)
        
        # Handle multiple actions
        actions = result.get('actions', [])
        if result.get('action'):
            actions = [result['action']]
        
        if actions and not result.get('cannot_do'):
            from datetime import datetime, timedelta
            
            created_project_id = None
            action_results = []
            
            for action_data in actions:
                action_type = action_data.get('action')
                
                if action_type == 'create_project':
                    try:
                        end_date = None
                        deadline_days = action_data.get('deadline_days')
                        if deadline_days:
                            try:
                                days = int(str(deadline_days).replace('working days', '').replace('days', '').strip())
                                current_date = datetime.now().date()
                                working_days = 0
                                check_date = current_date
                                while working_days < days:
                                    if check_date.weekday() < 5:
                                        working_days += 1
                                    if working_days < days:
                                        check_date += timedelta(days=1)
                                end_date = check_date
                            except (ValueError, TypeError):
                                pass
                        
                        project = Project.objects.create(
                            name=action_data.get('project_name', 'New Project'),
                            description=action_data.get('project_description', ''),
                            owner=request.user,
                            status=action_data.get('project_status', 'planning'),
                            priority=action_data.get('project_priority', 'medium'),
                            end_date=end_date
                        )
                        
                        created_project_id = project.id
                        action_results.append({
                            'action': 'create_project',
                            'success': True,
                            'project_id': project.id,
                            'project_name': project.name,
                            'message': f'Project "{project.name}" created successfully!'
                        })
                        
                        result['answer'] += f"\n\n✅ **Project Created Successfully!**\n- Project: {project.name}\n- Status: {project.get_status_display()}\n- Priority: {project.get_priority_display()}"
                        if end_date:
                            result['answer'] += f"\n- Deadline: {end_date.strftime('%B %d, %Y')}"
                    except Exception as e:
                        action_results.append({
                            'action': 'create_project',
                            'success': False,
                            'error': str(e)
                        })
                
                elif action_type == 'create_task':
                    try:
                        task_project_id = action_data.get('project_id')
                        
                        if not task_project_id and created_project_id:
                            task_project_id = created_project_id
                        elif not task_project_id and project_id:
                            task_project_id = project_id
                        elif not task_project_id and context.get('project'):
                            task_project_id = context['project']['id']
                        elif not task_project_id and context.get('all_projects') and len(context.get('all_projects', [])) > 0:
                            task_project_id = context['all_projects'][0]['id']
                        
                        if not task_project_id:
                            action_results.append({
                                'action': 'create_task',
                                'success': False,
                                'error': f"Could not determine which project to create task '{action_data.get('task_title', 'Unknown')}' in."
                            })
                        else:
                            task_project = get_object_or_404(Project, id=task_project_id, owner=request.user)
                            
                            task = Task.objects.create(
                                title=action_data.get('task_title', 'New Task'),
                                description=action_data.get('task_description', ''),
                                project=task_project,
                                status=action_data.get('status', 'todo'),
                                priority=action_data.get('priority', 'medium'),
                                assignee_id=action_data.get('assignee_id') if action_data.get('assignee_id') else None
                            )
                            
                            action_results.append({
                                'action': 'create_task',
                                'success': True,
                                'task_id': task.id,
                                'task_title': task.title,
                                'project_name': task_project.name,
                                'message': f'Task "{task.title}" created successfully!'
                            })
                            
                            result['answer'] += f"\n\n✅ **Task Created: {task.title}**\n- Project: {task_project.name}\n- Status: {task.get_status_display()}\n- Priority: {task.get_priority_display()}"
                            if task.assignee:
                                result['answer'] += f"\n- Assigned to: {task.assignee.username}"
                    except Exception as e:
                        action_results.append({
                            'action': 'create_task',
                            'success': False,
                            'error': f"Error creating task: {str(e)}"
                        })
                
                elif action_type == 'delete_project':
                    try:
                        project_id_to_delete = action_data.get('project_id')
                        if not project_id_to_delete:
                            action_results.append({
                                'action': 'delete_project',
                                'success': False,
                                'error': f"Project ID not provided for deletion."
                            })
                        else:
                            # Verify project ownership and delete
                            project_to_delete = get_object_or_404(Project, id=project_id_to_delete, owner=request.user)
                            project_name = project_to_delete.name
                            project_to_delete.delete()
                            
                            action_results.append({
                                'action': 'delete_project',
                                'success': True,
                                'project_id': project_id_to_delete,
                                'project_name': project_name,
                                'message': f'Project "{project_name}" deleted successfully!'
                            })
                            
                            if not result.get('answer'):
                                result['answer'] = ""
                            result['answer'] += f"\n\n✅ **Project Deleted: {project_name}**"
                    except Exception as e:
                        action_results.append({
                            'action': 'delete_project',
                            'success': False,
                            'error': f"Error deleting project: {str(e)}"
                        })
                
                elif action_type == 'delete_task':
                    try:
                        task_id_to_delete = action_data.get('task_id')
                        if not task_id_to_delete:
                            action_results.append({
                                'action': 'delete_task',
                                'success': False,
                                'error': f"Task ID not provided for deletion."
                            })
                        else:
                            # Verify task belongs to user's project and delete
                            task_to_delete = get_object_or_404(Task, id=task_id_to_delete, project__owner=request.user)
                            task_title = task_to_delete.title
                            task_project_name = task_to_delete.project.name
                            task_to_delete.delete()
                            
                            action_results.append({
                                'action': 'delete_task',
                                'success': True,
                                'task_id': task_id_to_delete,
                                'task_title': task_title,
                                'project_name': task_project_name,
                                'message': f'Task "{task_title}" deleted successfully!'
                            })
                            
                            if not result.get('answer'):
                                result['answer'] = ""
                            result['answer'] += f"\n\n✅ **Task Deleted: {task_title}** (from project: {task_project_name})"
                    except Exception as e:
                        action_results.append({
                            'action': 'delete_task',
                            'success': False,
                            'error': f"Error deleting task: {str(e)}"
                        })
            
            result['action_results'] = action_results
            result['actions'] = actions
        
        return JsonResponse(result)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@login_required
@require_http_methods(["POST"])
def test_timeline_gantt(request):
    """Test Timeline/Gantt Agent"""
    try:
        agent = AgentRegistry.get_agent("timeline_gantt")
        data = json.loads(request.body)
        action = data.get('action', 'create_timeline')
        project_id = data.get('project_id')
        
        if not project_id:
            return JsonResponse({
                'success': False,
                'error': 'project_id is required'
            }, status=400)
        
        # Verify project belongs to user
        project = get_object_or_404(Project, id=project_id, owner=request.user)
        
        # Get tasks for the project
        tasks_queryset = Task.objects.filter(project=project).select_related('assignee').prefetch_related('depends_on')
        
        # Convert tasks to dict format
        tasks = []
        for task in tasks_queryset:
            tasks.append({
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'status': task.status,
                'priority': task.priority,
                'due_date': task.due_date.isoformat() if task.due_date else None,
                'assignee_id': task.assignee.id if task.assignee else None,
                'estimated_hours': float(task.estimated_hours) if task.estimated_hours else None,
                'actual_hours': float(task.actual_hours) if task.actual_hours else None,
                'dependencies': list(task.depends_on.values_list('id', flat=True)),
                'created_at': task.created_at.isoformat() if task.created_at else None
            })
        
        # Prepare kwargs based on action
        kwargs = {
            'project_id': project_id,
            'tasks': tasks
        }
        
        # Add action-specific parameters
        if action == 'check_deadlines':
            kwargs['days_ahead'] = data.get('days_ahead', 7)
        elif action == 'suggest_adjustments':
            kwargs['current_progress'] = data.get('current_progress', {})
        elif action == 'calculate_duration':
            kwargs['tasks'] = tasks
        elif action == 'manage_phases':
            kwargs['phases'] = data.get('phases')
        
        # Process with agent
        result = agent.process(action=action, **kwargs)
        
        return JsonResponse(result)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
