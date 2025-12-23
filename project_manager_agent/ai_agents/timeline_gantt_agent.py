"""
Project Timeline / Gantt Agent
Manages project timelines, creates Gantt charts, and tracks project schedules.
"""

from .base_agent import BaseAgent
from typing import Dict, List, Optional
from datetime import datetime, timedelta, timezone as dt_timezone
from django.utils import timezone
from core.models import Project, Task


class TimelineGanttAgent(BaseAgent):
    """
    Agent responsible for:
    - Create and visualize project timelines
    - Generate Gantt charts for project visualization
    - Track project milestones and deadlines
    - Identify timeline conflicts and dependencies
    - Identify dependencies: Highlight task relationships to avoid bottlenecks
    - Enhance collaboration: Provide a shared view of the project for all stakeholders
    - Suggest timeline adjustments based on progress
    - Calculate project duration estimates
    - Manage project phases and stages
    - Alert on upcoming deadlines and milestones
    """
    
    def __init__(self):
        super().__init__()
        self.system_prompt = """You are a Project Timeline / Gantt Agent for a project management system.
        Your role is to manage project timelines, create schedules, and visualize project progress.
        You should consider dependencies, resources, and constraints when planning timelines."""
    
    def create_timeline(self, project_id: int, tasks: List[Dict]) -> Dict:
        """
        Create a project timeline from tasks - maps out tasks and milestones in chronological order.
        
        Args:
            project_id (int): Project ID
            tasks (List[Dict]): List of tasks with durations and dependencies
            
        Returns:
            Dict: Timeline data with tasks organized chronologically
        """
        self.log_action("Creating timeline", {"project_id": project_id, "tasks_count": len(tasks)})
        
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return {
                'success': False,
                'error': f'Project with ID {project_id} not found'
            }
        
        # Sort tasks by due_date, then by priority, then by created_at
        # Use a far future date for tasks without due dates
        far_future = datetime(9999, 12, 31, tzinfo=dt_timezone.utc)
        far_past = datetime(1900, 1, 1, tzinfo=dt_timezone.utc)
        
        def get_date_value(date_str_or_obj):
            """Convert date string or datetime object to comparable datetime"""
            if not date_str_or_obj:
                return far_future
            if isinstance(date_str_or_obj, str):
                try:
                    # Try parsing ISO format string
                    return datetime.fromisoformat(date_str_or_obj.replace('Z', '+00:00'))
                except (ValueError, AttributeError):
                    return far_future
            if isinstance(date_str_or_obj, datetime):
                return date_str_or_obj
            return far_future
        
        sorted_tasks = sorted(
            tasks,
            key=lambda t: (
                get_date_value(t.get('due_date')),
                {'high': 0, 'medium': 1, 'low': 2}.get(t.get('priority', 'medium'), 1),
                get_date_value(t.get('created_at'))
            )
        )
        
        # Group tasks by status for better visualization
        timeline_data = {
            'project_id': project_id,
            'project_name': project.name,
            'project_start_date': project.start_date.isoformat() if project.start_date else None,
            'project_end_date': project.end_date.isoformat() if project.end_date else None,
            'timeline_created_at': timezone.now().isoformat(),
            'tasks': [],
            'milestones': [],
            'phases': []
        }
        
        # Process each task and add to timeline
        for task in sorted_tasks:
            task_data = {
                'id': task.get('id'),
                'title': task.get('title', 'Untitled Task'),
                'description': task.get('description', ''),
                'status': task.get('status', 'todo'),
                'priority': task.get('priority', 'medium'),
                'due_date': task.get('due_date'),
                'estimated_hours': task.get('estimated_hours'),
                'assignee_id': task.get('assignee_id'),
                'dependencies': task.get('dependencies', [])
            }
            timeline_data['tasks'].append(task_data)
        
        # Identify milestones (tasks with high priority or key dependencies)
        milestones = []
        for task in sorted_tasks:
            if task.get('priority') == 'high' or len(task.get('dependencies', [])) > 2:
                milestones.append({
                    'task_id': task.get('id'),
                    'title': task.get('title'),
                    'due_date': task.get('due_date'),
                    'type': 'high_priority' if task.get('priority') == 'high' else 'key_dependency'
                })
        timeline_data['milestones'] = milestones
        
        # Calculate timeline summary
        total_tasks = len(sorted_tasks)
        completed_tasks = sum(1 for t in sorted_tasks if t.get('status') == 'done')
        in_progress_tasks = sum(1 for t in sorted_tasks if t.get('status') == 'in_progress')
        
        timeline_data['summary'] = {
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'in_progress_tasks': in_progress_tasks,
            'todo_tasks': total_tasks - completed_tasks - in_progress_tasks,
            'completion_percentage': round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 2)
        }
        
        return {
            'success': True,
            'timeline': timeline_data
        }
    
    def generate_gantt_chart(self, project_id: int) -> Dict:
        """
        Generate Gantt chart data for visualization.
        
        Args:
            project_id (int): Project ID
            
        Returns:
            Dict: Gantt chart data with start/end dates for each task
        """
        self.log_action("Generating Gantt chart", {"project_id": project_id})
        
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return {
                'success': False,
                'error': f'Project with ID {project_id} not found'
            }
        
        # Get all tasks for the project
        tasks_queryset = Task.objects.filter(project=project).select_related('assignee').prefetch_related('depends_on')
        
        gantt_data = {
            'project_id': project_id,
            'project_name': project.name,
            'project_start': project.start_date.isoformat() if project.start_date else None,
            'project_end': project.end_date.isoformat() if project.end_date else None,
            'tasks': []
        }
        
        # Calculate start and end dates for each task
        project_start = project.start_date or timezone.now().date()
        
        for task in tasks_queryset:
            # Calculate task start date (consider dependencies)
            task_start = project_start
            if task.depends_on.exists():
                # Start after the latest dependency ends
                latest_dependency_end = None
                for dep_task in task.depends_on.all():
                    if dep_task.due_date:
                        dep_end = dep_task.due_date.date()
                        if not latest_dependency_end or dep_end > latest_dependency_end:
                            latest_dependency_end = dep_end
                if latest_dependency_end:
                    task_start = latest_dependency_end + timedelta(days=1)
            
            # Calculate task end date
            task_end = task.due_date.date() if task.due_date else None
            if not task_end:
                # Estimate end date based on estimated hours
                if task.estimated_hours:
                    # Assume 8 hours per day
                    days_to_add = max(1, int(task.estimated_hours / 8))
                    task_end = task_start + timedelta(days=days_to_add)
                else:
                    # Default to 3 days if no estimate
                    task_end = task_start + timedelta(days=3)
            
            # Get dependencies
            dependencies = [dep.id for dep in task.depends_on.all()]
            
            gantt_task = {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'start_date': task_start.isoformat(),
                'end_date': task_end.isoformat(),
                'status': task.status,
                'priority': task.priority,
                'assignee': task.assignee.username if task.assignee else None,
                'assignee_id': task.assignee.id if task.assignee else None,
                'estimated_hours': float(task.estimated_hours) if task.estimated_hours else None,
                'actual_hours': float(task.actual_hours) if task.actual_hours else None,
                'dependencies': dependencies,
                'progress': 100 if task.status == 'done' else (50 if task.status == 'in_progress' else 0)
            }
            
            gantt_data['tasks'].append(gantt_task)
        
        # Sort tasks by start date
        gantt_data['tasks'].sort(key=lambda x: x['start_date'])
        
        # Calculate overall project timeline
        if gantt_data['tasks']:
            earliest_start = min(t['start_date'] for t in gantt_data['tasks'])
            latest_end = max(t['end_date'] for t in gantt_data['tasks'])
            gantt_data['timeline'] = {
                'start': earliest_start,
                'end': latest_end
            }
        
        return {
            'success': True,
            'gantt_chart': gantt_data
        }
    
    def track_milestones(self, project_id: int) -> Dict:
        """
        Track project milestones and deadlines.
        
        Args:
            project_id (int): Project ID
            
        Returns:
            Dict: Milestone tracking data with status and progress
        """
        self.log_action("Tracking milestones", {"project_id": project_id})
        
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return {
                'success': False,
                'error': f'Project with ID {project_id} not found'
            }
        
        # Get all tasks
        tasks = Task.objects.filter(project=project)
        
        milestones = []
        now = timezone.now()
        
        # Identify milestones (high priority tasks, tasks with many dependencies, or key tasks)
        for task in tasks:
            is_milestone = (
                task.priority == 'high' or
                task.depends_on.count() > 2 or
                task.dependent_tasks.count() > 2
            )
            
            if is_milestone:
                milestone_status = 'completed' if task.status == 'done' else (
                    'in_progress' if task.status == 'in_progress' else 'upcoming'
                )
                
                days_until_due = None
                if task.due_date:
                    delta = task.due_date - now
                    days_until_due = delta.days
                
                milestones.append({
                    'task_id': task.id,
                    'title': task.title,
                    'description': task.description,
                    'status': milestone_status,
                    'due_date': task.due_date.isoformat() if task.due_date else None,
                    'days_until_due': days_until_due,
                    'priority': task.priority,
                    'assignee': task.assignee.username if task.assignee else None,
                    'is_overdue': days_until_due < 0 if days_until_due is not None else False
                })
        
        # Sort milestones by due date
        milestones.sort(key=lambda m: (
            m['due_date'] if m['due_date'] else '9999-12-31',
            {'high': 0, 'medium': 1, 'low': 2}.get(m['priority'], 1)
        ))
        
        # Calculate milestone statistics
        total_milestones = len(milestones)
        completed_milestones = sum(1 for m in milestones if m['status'] == 'completed')
        overdue_milestones = sum(1 for m in milestones if m.get('is_overdue', False))
        
        return {
            'success': True,
            'milestones': milestones,
            'summary': {
                'total_milestones': total_milestones,
                'completed_milestones': completed_milestones,
                'in_progress_milestones': sum(1 for m in milestones if m['status'] == 'in_progress'),
                'upcoming_milestones': sum(1 for m in milestones if m['status'] == 'upcoming'),
                'overdue_milestones': overdue_milestones,
                'completion_rate': round((completed_milestones / total_milestones * 100) if total_milestones > 0 else 0, 2)
            }
        }
    
    def identify_conflicts(self, project_id: int) -> Dict:
        """
        Identify timeline conflicts and dependencies.
        
        Args:
            project_id (int): Project ID
            
        Returns:
            Dict: Conflict analysis with dependency issues and timeline conflicts
        """
        self.log_action("Identifying conflicts", {"project_id": project_id})
        
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return {
                'success': False,
                'error': f'Project with ID {project_id} not found'
            }
        
        tasks = Task.objects.filter(project=project).prefetch_related('depends_on', 'dependent_tasks')
        
        conflicts = []
        dependency_issues = []
        
        # Check for circular dependencies
        def has_circular_dependency(task, visited=None, path=None):
            if visited is None:
                visited = set()
            if path is None:
                path = []
            
            if task.id in path:
                return True, path + [task.id]
            
            if task.id in visited:
                return False, []
            
            visited.add(task.id)
            path.append(task.id)
            
            for dep in task.depends_on.all():
                has_circle, circle_path = has_circular_dependency(dep, visited, path.copy())
                if has_circle:
                    return True, circle_path
            
            return False, []
        
        # Check each task for conflicts
        for task in tasks:
            # Check circular dependencies
            has_circle, circle_path = has_circular_dependency(task)
            if has_circle:
                dependency_issues.append({
                    'type': 'circular_dependency',
                    'task_id': task.id,
                    'task_title': task.title,
                    'circular_path': circle_path,
                    'severity': 'high',
                    'description': f'Circular dependency detected involving task: {task.title}'
                })
            
            # Check if task's due date is before its dependencies' due dates
            if task.due_date:
                for dep_task in task.depends_on.all():
                    if dep_task.due_date and dep_task.due_date > task.due_date:
                        conflicts.append({
                            'type': 'dependency_timing_conflict',
                            'task_id': task.id,
                            'task_title': task.title,
                            'task_due_date': task.due_date.isoformat(),
                            'dependency_id': dep_task.id,
                            'dependency_title': dep_task.title,
                            'dependency_due_date': dep_task.due_date.isoformat(),
                            'severity': 'high',
                            'description': f'Task "{task.title}" is due before its dependency "{dep_task.title}"'
                        })
            
            # Check for overlapping assignments (same person, overlapping timeframes)
            if task.assignee and task.due_date:
                overlapping_tasks = Task.objects.filter(
                    project=project,
                    assignee=task.assignee,
                    due_date__isnull=False,
                    status__in=['todo', 'in_progress']
                ).exclude(id=task.id)
                
                for other_task in overlapping_tasks:
                    if other_task.due_date:
                        # Check if dates overlap significantly
                        task_start = task.due_date - timedelta(days=3)  # Assume 3 days before due
                        task_end = task.due_date
                        other_start = other_task.due_date - timedelta(days=3)
                        other_end = other_task.due_date
                        
                        if not (task_end < other_start or task_start > other_end):
                            conflicts.append({
                                'type': 'resource_overload',
                                'task_id': task.id,
                                'task_title': task.title,
                                'conflicting_task_id': other_task.id,
                                'conflicting_task_title': other_task.title,
                                'assignee': task.assignee.username,
                                'assignee_id': task.assignee.id,
                                'severity': 'medium',
                                'description': f'"{task.assignee.username}" has overlapping deadlines for "{task.title}" and "{other_task.title}"'
                            })
        
        # Check for missing dependencies (tasks that should depend on others but don't)
        for task in tasks:
            # If a task has many dependent tasks, it might be a critical path item
            dependent_count = task.dependent_tasks.count()
            if dependent_count > 3 and task.status in ['todo', 'in_progress']:
                if not task.due_date:
                    conflicts.append({
                        'type': 'missing_deadline',
                        'task_id': task.id,
                        'task_title': task.title,
                        'dependent_tasks_count': dependent_count,
                        'severity': 'medium',
                        'description': f'Task "{task.title}" has {dependent_count} dependent tasks but no deadline set'
                    })
        
        return {
            'success': True,
            'conflicts': conflicts,
            'dependency_issues': dependency_issues,
            'summary': {
                'total_conflicts': len(conflicts) + len(dependency_issues),
                'timing_conflicts': sum(1 for c in conflicts if c['type'] == 'dependency_timing_conflict'),
                'resource_overloads': sum(1 for c in conflicts if c['type'] == 'resource_overload'),
                'circular_dependencies': len(dependency_issues),
                'missing_deadlines': sum(1 for c in conflicts if c['type'] == 'missing_deadline'),
                'high_severity': sum(1 for c in conflicts + dependency_issues if c.get('severity') == 'high'),
                'medium_severity': sum(1 for c in conflicts + dependency_issues if c.get('severity') == 'medium')
            }
        }
    
    def suggest_adjustments(self, project_id: int, current_progress: Dict) -> Dict:
        """
        Suggest timeline adjustments based on progress - monitor task completion and adjust timelines.
        
        Args:
            project_id (int): Project ID
            current_progress (Dict): Current project progress data
            
        Returns:
            Dict: Timeline adjustment suggestions
        """
        self.log_action("Suggesting timeline adjustments", {"project_id": project_id})
        
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return {
                'success': False,
                'error': f'Project with ID {project_id} not found'
            }
        
        # Get all tasks
        tasks = Task.objects.filter(project=project).select_related('assignee').prefetch_related('depends_on')
        
        suggestions = []
        now = timezone.now()
        
        # Analyze each task's progress
        for task in tasks:
            if task.status in ['todo', 'in_progress', 'review']:
                # Check if task is behind schedule
                if task.due_date and task.due_date < now:
                    days_overdue = (now - task.due_date).days
                    suggestions.append({
                        'type': 'extend_deadline',
                        'task_id': task.id,
                        'task_title': task.title,
                        'current_due_date': task.due_date.isoformat(),
                        'days_overdue': days_overdue,
                        'suggested_extension_days': max(3, days_overdue + 2),
                        'reason': f'Task is {days_overdue} day(s) overdue'
                    })
                
                # Check if estimated hours vs actual hours indicate delay
                if task.estimated_hours and task.actual_hours:
                    if task.actual_hours > task.estimated_hours * 1.2:  # 20% over estimate
                        overage_percentage = ((task.actual_hours - task.estimated_hours) / task.estimated_hours) * 100
                        suggestions.append({
                            'type': 'revise_estimate',
                            'task_id': task.id,
                            'task_title': task.title,
                            'current_estimate': task.estimated_hours,
                            'actual_hours': task.actual_hours,
                            'overage_percentage': round(overage_percentage, 1),
                            'reason': f'Task is taking {round(overage_percentage, 1)}% longer than estimated'
                        })
        
        # Check overall project progress
        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status='done').count()
        completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        # If project is behind schedule
        if project.end_date:
            days_remaining = (project.end_date - now.date()).days
            if days_remaining > 0:
                expected_completion_rate = ((now.date() - (project.start_date or project.created_at.date())).days / 
                                          (project.end_date - (project.start_date or project.created_at.date())).days * 100)
                
                if completion_rate < expected_completion_rate - 10:  # 10% behind
                    suggestions.append({
                        'type': 'extend_project_deadline',
                        'project_id': project.id,
                        'project_name': project.name,
                        'current_completion_rate': round(completion_rate, 1),
                        'expected_completion_rate': round(expected_completion_rate, 1),
                        'current_end_date': project.end_date.isoformat(),
                        'suggested_extension_days': max(7, int((expected_completion_rate - completion_rate) / 10)),
                        'reason': f'Project is {round(expected_completion_rate - completion_rate, 1)}% behind expected progress'
                    })
        
        # Check for resource bottlenecks (too many tasks assigned to one person)
        assignee_counts = {}
        for task in tasks.filter(status__in=['todo', 'in_progress']):
            if task.assignee:
                assignee_id = task.assignee.id
                assignee_counts[assignee_id] = assignee_counts.get(assignee_id, 0) + 1
        
        for assignee_id, count in assignee_counts.items():
            if count > 5:  # More than 5 active tasks
                assignee = tasks.filter(assignee_id=assignee_id).first().assignee
                suggestions.append({
                    'type': 'redistribute_workload',
                    'assignee_id': assignee_id,
                    'assignee_name': assignee.username,
                    'current_task_count': count,
                    'reason': f'{assignee.username} has {count} active tasks, consider redistributing'
                })
        
        return {
            'success': True,
            'suggestions': suggestions,
            'summary': {
                'total_suggestions': len(suggestions),
                'deadline_extensions': sum(1 for s in suggestions if s['type'] == 'extend_deadline'),
                'estimate_revisions': sum(1 for s in suggestions if s['type'] == 'revise_estimate'),
                'workload_redistributions': sum(1 for s in suggestions if s['type'] == 'redistribute_workload'),
                'project_extensions': sum(1 for s in suggestions if s['type'] == 'extend_project_deadline')
            }
        }
    
    def calculate_duration_estimate(self, tasks: List[Dict]) -> Dict:
        """
        Calculate project duration estimates based on tasks.
        
        Args:
            tasks (List[Dict]): List of tasks with estimated hours and dependencies
            
        Returns:
            Dict: Duration estimates including optimistic, realistic, and pessimistic scenarios
        """
        self.log_action("Calculating duration estimate", {"tasks_count": len(tasks)})
        
        if not tasks:
            return {
                'success': False,
                'error': 'No tasks provided for duration estimation'
            }
        
        # Calculate total estimated hours
        total_estimated_hours = sum(
            task.get('estimated_hours', 0) or 0 
            for task in tasks 
            if task.get('estimated_hours')
        )
        
        # If no estimated hours, use default estimates based on task count
        if total_estimated_hours == 0:
            # Default: 8 hours per task
            total_estimated_hours = len(tasks) * 8
        
        # Calculate working days (assuming 8 hours per day)
        working_days = total_estimated_hours / 8
        
        # Consider dependencies (critical path)
        # Simple approach: if tasks have dependencies, add buffer
        tasks_with_deps = sum(1 for task in tasks if task.get('dependencies'))
        dependency_buffer = tasks_with_deps * 0.5  # 0.5 days per dependency
        
        # Three-point estimation (PERT)
        optimistic_days = working_days * 0.8  # 20% faster
        realistic_days = working_days + dependency_buffer
        pessimistic_days = working_days * 1.5 + dependency_buffer  # 50% slower
        
        # Expected duration (PERT formula)
        expected_days = (optimistic_days + 4 * realistic_days + pessimistic_days) / 6
        
        # Calculate calendar days (assuming 5 working days per week)
        calendar_weeks = expected_days / 5
        calendar_days = calendar_weeks * 7
        
        # Get date range if tasks have due dates
        tasks_with_dates = [t for t in tasks if t.get('due_date')]
        if tasks_with_dates:
            dates = [datetime.fromisoformat(t['due_date'].replace('Z', '+00:00')) for t in tasks_with_dates if t.get('due_date')]
            if dates:
                earliest_date = min(dates)
                latest_date = max(dates)
                actual_span_days = (latest_date - earliest_date).days
            else:
                actual_span_days = None
        else:
            actual_span_days = None
        
        return {
            'success': True,
            'estimates': {
                'total_tasks': len(tasks),
                'total_estimated_hours': round(total_estimated_hours, 2),
                'working_days': {
                    'optimistic': round(optimistic_days, 1),
                    'realistic': round(realistic_days, 1),
                    'pessimistic': round(pessimistic_days, 1),
                    'expected': round(expected_days, 1)
                },
                'calendar_days': {
                    'expected': round(calendar_days, 1),
                    'weeks': round(calendar_weeks, 1)
                },
                'actual_span_days': actual_span_days,
                'tasks_with_dependencies': tasks_with_deps,
                'dependency_buffer_days': round(dependency_buffer, 1)
            },
            'recommendations': {
                'suggested_deadline_days': round(expected_days + 3, 1),  # Add 3 day buffer
                'suggested_deadline_weeks': round((expected_days + 3) / 5, 1),
                'note': 'Estimates assume 8-hour working days and 5-day work weeks. Add buffer for unexpected delays.'
            }
        }
    
    def manage_phases(self, project_id: int, phases: List[Dict] = None) -> Dict:
        """
        Manage project phases and stages.
        
        Args:
            project_id (int): Project ID
            phases (List[Dict]): Optional list of project phases
            
        Returns:
            Dict: Phase management data
        """
        self.log_action("Managing phases", {"project_id": project_id})
        
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return {
                'success': False,
                'error': f'Project with ID {project_id} not found'
            }
        
        # Group tasks by status as phases
        tasks = Task.objects.filter(project=project)
        
        phases_data = []
        phase_order = ['todo', 'in_progress', 'review', 'done']
        
        for phase_status in phase_order:
            phase_tasks = tasks.filter(status=phase_status)
            if phase_tasks.exists():
                phases_data.append({
                    'phase': phase_status.replace('_', ' ').title(),
                    'status': phase_status,
                    'task_count': phase_tasks.count(),
                    'tasks': [{
                        'id': t.id,
                        'title': t.title,
                        'priority': t.priority,
                        'due_date': t.due_date.isoformat() if t.due_date else None
                    } for t in phase_tasks[:10]]  # Limit to 10 tasks per phase
                })
        
        return {
            'success': True,
            'phases': phases_data,
            'total_phases': len(phases_data)
        }
    
    def check_upcoming_deadlines(self, project_id: int, days_ahead: int = 7) -> Dict:
        """
        Check and alert on upcoming deadlines and milestones.
        
        Args:
            project_id (int): Project ID
            days_ahead (int): Number of days to look ahead
            
        Returns:
            Dict: Upcoming deadlines and alerts
        """
        self.log_action("Checking upcoming deadlines", {"project_id": project_id, "days_ahead": days_ahead})
        
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return {
                'success': False,
                'error': f'Project with ID {project_id} not found'
            }
        
        now = timezone.now()
        future_date = now + timedelta(days=days_ahead)
        
        # Get tasks with deadlines in the next N days
        upcoming_tasks = Task.objects.filter(
            project=project,
            due_date__gte=now,
            due_date__lte=future_date,
            status__in=['todo', 'in_progress', 'review']
        ).select_related('assignee').order_by('due_date')
        
        # Get overdue tasks
        overdue_tasks = Task.objects.filter(
            project=project,
            due_date__lt=now,
            status__in=['todo', 'in_progress', 'review']
        ).select_related('assignee').order_by('due_date')
        
        alerts = []
        
        # Process upcoming tasks
        for task in upcoming_tasks:
            days_until = (task.due_date - now).days
            urgency = 'high' if days_until <= 2 else ('medium' if days_until <= 5 else 'low')
            
            alerts.append({
                'type': 'upcoming',
                'task_id': task.id,
                'title': task.title,
                'due_date': task.due_date.isoformat(),
                'days_until': days_until,
                'urgency': urgency,
                'status': task.status,
                'priority': task.priority,
                'assignee': task.assignee.username if task.assignee else None
            })
        
        # Process overdue tasks
        for task in overdue_tasks:
            days_overdue = (now - task.due_date).days
            alerts.append({
                'type': 'overdue',
                'task_id': task.id,
                'title': task.title,
                'due_date': task.due_date.isoformat(),
                'days_overdue': days_overdue,
                'urgency': 'critical',
                'status': task.status,
                'priority': task.priority,
                'assignee': task.assignee.username if task.assignee else None
            })
        
        # Check project deadline
        if project.end_date:
            project_days_until = (project.end_date - now.date()).days
            if 0 <= project_days_until <= days_ahead:
                alerts.append({
                    'type': 'project_deadline',
                    'project_id': project.id,
                    'project_name': project.name,
                    'due_date': project.end_date.isoformat(),
                    'days_until': project_days_until,
                    'urgency': 'high' if project_days_until <= 3 else 'medium'
                })
        
        # Sort alerts by urgency and date
        urgency_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        alerts.sort(key=lambda a: (
            urgency_order.get(a.get('urgency', 'low'), 3),
            a.get('days_until', 999) if a.get('type') == 'upcoming' else -a.get('days_overdue', 0)
        ))
        
        return {
            'success': True,
            'alerts': alerts,
            'summary': {
                'total_alerts': len(alerts),
                'overdue_count': sum(1 for a in alerts if a['type'] == 'overdue'),
                'upcoming_count': sum(1 for a in alerts if a['type'] == 'upcoming'),
                'critical_count': sum(1 for a in alerts if a.get('urgency') == 'critical'),
                'high_urgency_count': sum(1 for a in alerts if a.get('urgency') == 'high')
            }
        }
    
    def identify_dependencies(self, project_id: int) -> Dict:
        """
        Identify dependencies: Highlight task relationships to avoid bottlenecks.
        
        Args:
            project_id (int): Project ID
            
        Returns:
            Dict: Dependency analysis with relationship mapping and bottleneck identification
        """
        self.log_action("Identifying dependencies", {"project_id": project_id})
        
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return {
                'success': False,
                'error': f'Project with ID {project_id} not found'
            }
        
        tasks = Task.objects.filter(project=project).select_related('assignee').prefetch_related('depends_on', 'dependent_tasks')
        
        dependency_map = []
        critical_path = []
        bottlenecks = []
        
        # Build dependency relationships
        for task in tasks:
            dependencies = task.depends_on.all()
            dependents = task.dependent_tasks.all()
            
            if dependencies.exists() or dependents.exists():
                dependency_info = {
                    'task_id': task.id,
                    'task_title': task.title,
                    'status': task.status,
                    'priority': task.priority,
                    'due_date': task.due_date.isoformat() if task.due_date else None,
                    'assignee': task.assignee.username if task.assignee else None,
                    'depends_on': [],
                    'dependent_tasks': [],
                    'dependency_count': dependencies.count(),
                    'dependent_count': dependents.count(),
                    'is_critical': False,
                    'is_bottleneck': False
                }
                
                # Map dependencies
                for dep in dependencies:
                    dependency_info['depends_on'].append({
                        'id': dep.id,
                        'title': dep.title,
                        'status': dep.status,
                        'due_date': dep.due_date.isoformat() if dep.due_date else None
                    })
                
                # Map dependent tasks
                for dep_task in dependents:
                    dependency_info['dependent_tasks'].append({
                        'id': dep_task.id,
                        'title': dep_task.title,
                        'status': dep_task.status,
                        'due_date': dep_task.due_date.isoformat() if dep_task.due_date else None
                    })
                
                # Identify critical path tasks (tasks with many dependents)
                if dependents.count() >= 3:
                    dependency_info['is_critical'] = True
                    critical_path.append({
                        'task_id': task.id,
                        'task_title': task.title,
                        'dependent_count': dependents.count(),
                        'reason': f'This task blocks {dependents.count()} other tasks'
                    })
                
                # Identify bottlenecks (tasks with many dependencies and many dependents)
                if dependencies.count() >= 2 and dependents.count() >= 2:
                    dependency_info['is_bottleneck'] = True
                    bottlenecks.append({
                        'task_id': task.id,
                        'task_title': task.title,
                        'dependency_count': dependencies.count(),
                        'dependent_count': dependents.count(),
                        'status': task.status,
                        'priority': task.priority,
                        'risk_level': 'high' if task.status in ['todo', 'blocked'] else 'medium',
                        'reason': f'Task has {dependencies.count()} dependencies and blocks {dependents.count()} tasks'
                    })
                
                dependency_map.append(dependency_info)
        
        # Identify potential bottleneck risks
        bottleneck_risks = []
        for task in tasks:
            if task.status in ['todo', 'blocked'] and task.dependent_tasks.count() > 0:
                blocking_count = task.dependent_tasks.filter(status__in=['todo', 'in_progress']).count()
                if blocking_count > 2:
                    bottleneck_risks.append({
                        'task_id': task.id,
                        'task_title': task.title,
                        'status': task.status,
                        'blocking_count': blocking_count,
                        'risk_level': 'high' if task.status == 'blocked' else 'medium',
                        'recommendation': f'Prioritize this task - it\'s blocking {blocking_count} other tasks'
                    })
        
        # Calculate dependency statistics
        total_dependencies = sum(len(d['depends_on']) for d in dependency_map)
        total_dependents = sum(len(d['dependent_tasks']) for d in dependency_map)
        max_dependency_depth = 0
        
        def calculate_depth(task_id, visited=None, depth=0):
            if visited is None:
                visited = set()
            if task_id in visited:
                return depth
            visited.add(task_id)
            
            task_info = next((d for d in dependency_map if d['task_id'] == task_id), None)
            if not task_info:
                return depth
            
            max_child_depth = depth
            for dep in task_info['depends_on']:
                child_depth = calculate_depth(dep['id'], visited.copy(), depth + 1)
                max_child_depth = max(max_child_depth, child_depth)
            
            return max_child_depth
        
        for task_info in dependency_map:
            depth = calculate_depth(task_info['task_id'])
            max_dependency_depth = max(max_dependency_depth, depth)
        
        return {
            'success': True,
            'dependency_map': dependency_map,
            'critical_path': critical_path,
            'bottlenecks': bottlenecks,
            'bottleneck_risks': bottleneck_risks,
            'summary': {
                'total_tasks_with_dependencies': len(dependency_map),
                'total_dependencies': total_dependencies,
                'total_dependents': total_dependents,
                'critical_path_tasks': len(critical_path),
                'bottleneck_tasks': len(bottlenecks),
                'high_risk_bottlenecks': sum(1 for b in bottlenecks if b['risk_level'] == 'high'),
                'max_dependency_depth': max_dependency_depth,
                'blocking_tasks': len(bottleneck_risks)
            }
        }
    
    def get_shared_view(self, project_id: int) -> Dict:
        """
        Enhance collaboration: Provide a shared view of the project for all stakeholders.
        
        Args:
            project_id (int): Project ID
            
        Returns:
            Dict: Comprehensive project view with tasks, assignments, timelines, and progress
        """
        self.log_action("Generating shared view", {"project_id": project_id})
        
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return {
                'success': False,
                'error': f'Project with ID {project_id} not found'
            }
        
        # Get all project data
        tasks = Task.objects.filter(project=project).select_related('assignee').prefetch_related('depends_on', 'dependent_tasks')
        team_members = project.team_members.select_related('user').all()
        
        # Project overview
        project_overview = {
            'id': project.id,
            'name': project.name,
            'description': project.description,
            'status': project.status,
            'priority': project.priority,
            'start_date': project.start_date.isoformat() if project.start_date else None,
            'end_date': project.end_date.isoformat() if project.end_date else None,
            'owner': project.owner.username,
            'created_at': project.created_at.isoformat(),
            'updated_at': project.updated_at.isoformat()
        }
        
        # Task breakdown by status
        tasks_by_status = {
            'todo': [],
            'in_progress': [],
            'review': [],
            'done': [],
            'blocked': []
        }
        
        for task in tasks:
            task_data = {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'priority': task.priority,
                'due_date': task.due_date.isoformat() if task.due_date else None,
                'assignee': task.assignee.username if task.assignee else None,
                'assignee_id': task.assignee.id if task.assignee else None,
                'estimated_hours': float(task.estimated_hours) if task.estimated_hours else None,
                'actual_hours': float(task.actual_hours) if task.actual_hours else None,
                'dependencies': [{'id': dep.id, 'title': dep.title} for dep in task.depends_on.all()],
                'dependent_tasks': [{'id': dep.id, 'title': dep.title} for dep in task.dependent_tasks.all()],
                'created_at': task.created_at.isoformat(),
                'updated_at': task.updated_at.isoformat()
            }
            tasks_by_status[task.status].append(task_data)
        
        # Team member workload
        team_workload = []
        for member in team_members:
            member_tasks = tasks.filter(assignee=member.user)
            active_tasks = member_tasks.filter(status__in=['todo', 'in_progress', 'review'])
            completed_tasks = member_tasks.filter(status='done')
            
            team_workload.append({
                'user_id': member.user.id,
                'username': member.user.username,
                'role': member.role,
                'total_tasks': member_tasks.count(),
                'active_tasks': active_tasks.count(),
                'completed_tasks': completed_tasks.count(),
                'tasks': [{
                    'id': t.id,
                    'title': t.title,
                    'status': t.status,
                    'priority': t.priority,
                    'due_date': t.due_date.isoformat() if t.due_date else None
                } for t in active_tasks[:10]]  # Limit to 10 tasks per member
            })
        
        # Also include project owner if not in team
        if project.owner not in [m.user for m in team_members]:
            owner_tasks = tasks.filter(assignee=project.owner)
            active_tasks = owner_tasks.filter(status__in=['todo', 'in_progress', 'review'])
            team_workload.append({
                'user_id': project.owner.id,
                'username': project.owner.username,
                'role': 'owner',
                'total_tasks': owner_tasks.count(),
                'active_tasks': active_tasks.count(),
                'completed_tasks': owner_tasks.filter(status='done').count(),
                'tasks': [{
                    'id': t.id,
                    'title': t.title,
                    'status': t.status,
                    'priority': t.priority,
                    'due_date': t.due_date.isoformat() if t.due_date else None
                } for t in active_tasks[:10]]
            })
        
        # Progress metrics
        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status='done').count()
        in_progress_tasks = tasks.filter(status='in_progress').count()
        blocked_tasks = tasks.filter(status='blocked').count()
        
        # Calculate completion percentage
        completion_percentage = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        # Timeline summary
        tasks_with_dates = tasks.exclude(due_date__isnull=True)
        if tasks_with_dates.exists():
            earliest_due = tasks_with_dates.order_by('due_date').first().due_date
            latest_due = tasks_with_dates.order_by('-due_date').first().due_date
        else:
            earliest_due = None
            latest_due = None
        
        # Priority distribution
        priority_distribution = {
            'high': tasks.filter(priority='high').count(),
            'medium': tasks.filter(priority='medium').count(),
            'low': tasks.filter(priority='low').count()
        }
        
        # Upcoming deadlines (next 7 days)
        now = timezone.now()
        next_week = now + timedelta(days=7)
        upcoming_deadlines = tasks.filter(
            due_date__gte=now,
            due_date__lte=next_week,
            status__in=['todo', 'in_progress', 'review']
        ).order_by('due_date')[:10]
        
        shared_view = {
            'project': project_overview,
            'tasks': {
                'by_status': tasks_by_status,
                'total': total_tasks,
                'completed': completed_tasks,
                'in_progress': in_progress_tasks,
                'blocked': blocked_tasks,
                'todo': len(tasks_by_status['todo']),
                'completion_percentage': round(completion_percentage, 2)
            },
            'team': {
                'members': team_workload,
                'total_members': len(team_workload)
            },
            'timeline': {
                'earliest_due_date': earliest_due.isoformat() if earliest_due else None,
                'latest_due_date': latest_due.isoformat() if latest_due else None,
                'project_start': project.start_date.isoformat() if project.start_date else None,
                'project_end': project.end_date.isoformat() if project.end_date else None
            },
            'metrics': {
                'priority_distribution': priority_distribution,
                'upcoming_deadlines': [{
                    'id': t.id,
                    'title': t.title,
                    'due_date': t.due_date.isoformat(),
                    'assignee': t.assignee.username if t.assignee else None,
                    'priority': t.priority
                } for t in upcoming_deadlines],
                'overdue_tasks': tasks.filter(
                    due_date__lt=now,
                    status__in=['todo', 'in_progress', 'review']
                ).count()
            },
            'generated_at': timezone.now().isoformat()
        }
        
        return {
            'success': True,
            'shared_view': shared_view
        }
    
    def process(self, action: str, **kwargs) -> Dict:
        """
        Main processing method for timeline agent - routes actions to appropriate methods.
        
        Args:
            action (str): Action to perform:
                - 'create_timeline': Create project timeline
                - 'generate_gantt': Generate Gantt chart
                - 'track_milestones': Track milestones
                - 'check_deadlines': Check upcoming deadlines
                - 'suggest_adjustments': Suggest timeline adjustments
                - 'identify_conflicts': Identify conflicts
                - 'identify_dependencies': Identify dependencies and bottlenecks
                - 'get_shared_view': Get shared view for collaboration
                - 'calculate_duration': Calculate duration estimates
                - 'manage_phases': Manage project phases
            **kwargs: Action-specific parameters
            
        Returns:
            dict: Processing results
        """
        self.log_action("Processing timeline action", {"action": action})
        
        project_id = kwargs.get('project_id')
        if not project_id:
            return {
                'success': False,
                'error': 'project_id is required'
            }
        
        try:
            if action == 'create_timeline':
                tasks = kwargs.get('tasks', [])
                return self.create_timeline(project_id, tasks)
            
            elif action == 'generate_gantt':
                return self.generate_gantt_chart(project_id)
            
            elif action == 'track_milestones':
                return self.track_milestones(project_id)
            
            elif action == 'check_deadlines':
                days_ahead = kwargs.get('days_ahead', 7)
                return self.check_upcoming_deadlines(project_id, days_ahead)
            
            elif action == 'suggest_adjustments':
                current_progress = kwargs.get('current_progress', {})
                return self.suggest_adjustments(project_id, current_progress)
            
            elif action == 'identify_conflicts':
                return self.identify_conflicts(project_id)
            
            elif action == 'identify_dependencies':
                return self.identify_dependencies(project_id)
            
            elif action == 'get_shared_view':
                return self.get_shared_view(project_id)
            
            elif action == 'calculate_duration':
                tasks = kwargs.get('tasks', [])
                return self.calculate_duration_estimate(tasks)
            
            elif action == 'manage_phases':
                phases = kwargs.get('phases')
                return self.manage_phases(project_id, phases)
            
            else:
                return {
                    'success': False,
                    'error': f'Unknown action: {action}',
                    'available_actions': [
                        'create_timeline', 'generate_gantt', 'track_milestones',
                        'check_deadlines', 'suggest_adjustments', 'identify_conflicts',
                        'identify_dependencies', 'get_shared_view', 'calculate_duration', 'manage_phases'
                    ]
                }
        
        except Exception as e:
            self.log_action("Error processing action", {"action": action, "error": str(e)})
            return {
                'success': False,
                'error': str(e)
            }

