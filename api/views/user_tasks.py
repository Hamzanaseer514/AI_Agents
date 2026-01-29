"""
User Tasks API Views
For regular users (not company users) to manage their tasks
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone

from core.models import Task, Project, UserProfile
from api.serializers.user_tasks import TaskSerializer, ProjectSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_tasks(request):
    """
    Get all tasks assigned to the current user
    GET /api/user/tasks
    """
    try:
        user = request.user
        
        # Get all tasks assigned to this user
        tasks = Task.objects.filter(assignee=user).select_related('project').order_by('-priority', 'due_date', '-created_at')
        
        # Filter by status if provided
        status_filter = request.GET.get('status')
        if status_filter:
            tasks = tasks.filter(status=status_filter)
        
        # Filter by project if provided
        project_id = request.GET.get('project_id')
        if project_id:
            tasks = tasks.filter(project_id=project_id)
        
        serializer = TaskSerializer(tasks, many=True)
        
        return Response({
            'status': 'success',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'status': 'error',
            'message': 'Failed to fetch tasks',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_projects(request):
    """
    Get all projects where the user is assigned tasks or is a team member
    GET /api/user/projects
    """
    try:
        user = request.user
        
        # Get projects where user has assigned tasks
        projects_with_tasks = Project.objects.filter(tasks__assignee=user).distinct()
        
        # Get projects where user is a team member (if TeamMember model exists)
        projects_as_member = Project.objects.none()
        try:
            from core.models import TeamMember
            projects_as_member = Project.objects.filter(team_members__user=user).distinct()
        except (ImportError, AttributeError):
            # TeamMember model might not exist, skip this filter
            pass
        
        # Combine both
        projects = (projects_with_tasks | projects_as_member).distinct().order_by('-created_at')
        
        # Filter by status if provided
        status_filter = request.GET.get('status')
        if status_filter:
            projects = projects.filter(status=status_filter)
        
        serializer = ProjectSerializer(projects, many=True, context={'request': request})
        
        return Response({
            'status': 'success',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'status': 'error',
            'message': 'Failed to fetch projects',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def update_task_status(request, taskId):
    """
    Update task status
    PATCH /api/user/tasks/{taskId}/status
    """
    try:
        user = request.user
        task = get_object_or_404(Task, id=taskId, assignee=user)
        
        new_status = request.data.get('status')
        if not new_status:
            return Response({
                'status': 'error',
                'message': 'Status is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate status
        valid_statuses = [choice[0] for choice in Task.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({
                'status': 'error',
                'message': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update status
        task.status = new_status
        
        # If marking as done, set completed_at
        if new_status == 'done' and not task.completed_at:
            task.completed_at = timezone.now()
        elif new_status != 'done':
            task.completed_at = None
        
        task.save()
        
        serializer = TaskSerializer(task)
        
        return Response({
            'status': 'success',
            'message': 'Task status updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Task.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Task not found or you do not have permission to update it'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': 'Failed to update task status',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def update_task_progress(request, taskId):
    """
    Update task progress percentage
    PATCH /api/user/tasks/{taskId}/progress
    """
    try:
        user = request.user
        task = get_object_or_404(Task, id=taskId, assignee=user)
        
        progress = request.data.get('progress_percentage')
        if progress is None:
            return Response({
                'status': 'error',
                'message': 'progress_percentage is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate progress (0-100)
        try:
            progress = int(progress)
            if progress < 0 or progress > 100:
                return Response({
                    'status': 'error',
                    'message': 'Progress must be between 0 and 100'
                }, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return Response({
                'status': 'error',
                'message': 'Progress must be a number'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update progress
        task.progress_percentage = progress
        
        # If progress is 100, mark as done
        if progress == 100 and task.status != 'done':
            task.status = 'done'
            if not task.completed_at:
                task.completed_at = timezone.now()
        
        task.save()
        
        serializer = TaskSerializer(task)
        
        return Response({
            'status': 'success',
            'message': 'Task progress updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Task.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Task not found or you do not have permission to update it'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': 'Failed to update task progress',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

