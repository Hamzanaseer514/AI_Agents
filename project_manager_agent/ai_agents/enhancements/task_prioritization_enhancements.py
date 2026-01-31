"""
Task Prioritization Agent Enhancements
Implements multi-factor scoring, critical path analysis, predictive adjustments
"""

from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from core.models import Task, Project
import logging

logger = logging.getLogger(__name__)


class TaskPrioritizationEnhancements:
    """Enhancement methods for Task Prioritization Agent"""
    
    @staticmethod
    def calculate_priority_score(task: Dict, context: Dict) -> float:
        """
        Calculate comprehensive priority score using multiple factors.
        
        Scoring weights:
        - Deadline urgency: 30%
        - Dependency criticality: 25%
        - Business value: 20%
        - Resource availability: 15%
        - Risk impact: 10%
        
        Args:
            task (Dict): Task data
            context (Dict): Project context
            
        Returns:
            float: Priority score (0-100)
        """
        score = 0.0
        
        # 1. Deadline urgency (30%)
        deadline_score = TaskPrioritizationEnhancements._deadline_score(task)
        score += deadline_score * 0.30
        
        # 2. Dependency criticality (25%)
        dependency_score = TaskPrioritizationEnhancements._dependency_score(task, context)
        score += dependency_score * 0.25
        
        # 3. Business value (20%)
        business_value_score = TaskPrioritizationEnhancements._business_value_score(task)
        score += business_value_score * 0.20
        
        # 4. Resource availability (15%)
        resource_score = TaskPrioritizationEnhancements._resource_availability_score(task, context)
        score += resource_score * 0.15
        
        # 5. Risk impact (10%)
        risk_score = TaskPrioritizationEnhancements._risk_impact_score(task)
        score += risk_score * 0.10
        
        return min(100.0, max(0.0, score))
    
    @staticmethod
    def _deadline_score(task: Dict) -> float:
        """Calculate deadline urgency score (0-100)"""
        due_date = task.get('due_date')
        if not due_date:
            return 30.0  # Medium score if no deadline
        
        try:
            if isinstance(due_date, str):
                due = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
            else:
                due = due_date
            
            now = datetime.now(due.tzinfo) if due.tzinfo else datetime.now()
            days_until = (due - now).days
            
            if days_until < 0:
                return 100.0  # Overdue = highest priority
            elif days_until <= 1:
                return 95.0
            elif days_until <= 3:
                return 85.0
            elif days_until <= 7:
                return 70.0
            elif days_until <= 14:
                return 50.0
            elif days_until <= 30:
                return 30.0
            else:
                return 20.0
        except Exception:
            return 30.0
    
    @staticmethod
    def _dependency_score(task: Dict, context: Dict) -> float:
        """Calculate dependency criticality score (0-100)"""
        dependencies = task.get('dependencies', [])
        dependent_count = task.get('dependent_count', 0)
        
        # Tasks with many dependents are critical
        if dependent_count >= 5:
            return 100.0
        elif dependent_count >= 3:
            return 80.0
        elif dependent_count >= 1:
            return 60.0
        
        # Tasks with many dependencies might be complex
        if len(dependencies) >= 3:
            return 50.0
        
        # Check if on critical path (from context)
        if context.get('critical_path'):
            task_id = task.get('id')
            critical_path_ids = [cp.get('task_id') for cp in context.get('critical_path', [])]
            if task_id in critical_path_ids:
                return 90.0
        
        return 30.0
    
    @staticmethod
    def _business_value_score(task: Dict) -> float:
        """Calculate business value score (0-100)"""
        # Use priority as indicator
        priority = task.get('priority', 'medium')
        priority_scores = {
            'high': 80.0,
            'medium': 50.0,
            'low': 20.0,
        }
        
        base_score = priority_scores.get(priority, 50.0)
        
        # Boost if task is completed (lower priority for done tasks)
        status = task.get('status', 'todo')
        if status == 'done':
            return 10.0
        
        # Boost if task is in progress
        if status == 'in_progress':
            return min(100.0, base_score + 20.0)
        
        return base_score
    
    @staticmethod
    def _resource_availability_score(task: Dict, context: Dict) -> float:
        """Calculate resource availability score (0-100)"""
        assignee_id = task.get('assignee_id')
        if not assignee_id:
            return 40.0  # Unassigned tasks get medium score
        
        # Check assignee workload from context
        workload_data = context.get('workload_analysis', {})
        workload_by_user = workload_data.get('workload_by_user', {})
        
        if assignee_id in workload_by_user:
            user_workload = workload_by_user[assignee_id]
            active_tasks = user_workload.get('active_tasks', 0)
            
            # Lower score if user is overloaded (they can't take more)
            if active_tasks >= 10:
                return 20.0
            elif active_tasks >= 5:
                return 50.0
            else:
                return 80.0
        
        return 50.0
    
    @staticmethod
    def _risk_impact_score(task: Dict) -> float:
        """Calculate risk impact score (0-100)"""
        status = task.get('status', 'todo')
        
        # Blocked tasks are high risk
        if status == 'blocked':
            return 90.0
        
        # Tasks in progress for a long time might be risky
        if status == 'in_progress':
            # Check if estimated hours exceeded
            estimated = task.get('estimated_hours', 0) or 0
            actual = task.get('actual_hours', 0) or 0
            
            if estimated > 0 and actual > estimated * 1.5:
                return 80.0  # Significantly over estimate
        
        # High priority tasks are higher risk if not done
        priority = task.get('priority', 'medium')
        if priority == 'high' and status != 'done':
            return 70.0
        
        return 30.0
    
    @staticmethod
    def calculate_critical_path(tasks: List[Dict]) -> Dict:
        """
        Calculate critical path using CPM (Critical Path Method).
        
        Args:
            tasks (List[Dict]): List of tasks with dependencies
            
        Returns:
            Dict: Critical path analysis
        """
        if not tasks:
            return {'critical_path': [], 'slack_times': {}}
        
        # Build dependency graph
        task_map = {task['id']: task for task in tasks}
        dependencies = {}
        dependents = {}
        
        for task in tasks:
            task_id = task['id']
            deps = task.get('dependencies', [])
            dependencies[task_id] = deps
            
            for dep_id in deps:
                if dep_id not in dependents:
                    dependents[dep_id] = []
                dependents[dep_id].append(task_id)
        
        # Forward pass: Calculate Early Start (ES) and Early Finish (EF)
        early_start = {}
        early_finish = {}
        
        def get_duration(task_data):
            """Get task duration in days"""
            hours = task_data.get('estimated_hours', 0) or 0
            if hours > 0:
                return max(1, int(hours / 8))  # 8 hours per day
            return 3  # Default 3 days
        
        def forward_pass(task_id, visited=None):
            if visited is None:
                visited = set()
            
            if task_id in visited:
                return early_start.get(task_id, 0)
            
            visited.add(task_id)
            task = task_map[task_id]
            
            # Get max early finish of dependencies
            dep_early_finishes = []
            for dep_id in dependencies.get(task_id, []):
                if dep_id in task_map:
                    forward_pass(dep_id, visited.copy())
                    dep_ef = early_finish.get(dep_id, 0)
                    dep_early_finishes.append(dep_ef)
            
            # Early start is max of dependency finishes
            es = max(dep_early_finishes) if dep_early_finishes else 0
            duration = get_duration(task)
            ef = es + duration
            
            early_start[task_id] = es
            early_finish[task_id] = ef
            
            return es
        
        # Process all tasks
        for task_id in task_map.keys():
            forward_pass(task_id)
        
        if not early_finish:
            return {'critical_path': [], 'slack_times': {}}
        
        # Project end is max early finish
        project_end = max(early_finish.values())
        
        # Backward pass: Calculate Late Start (LS) and Late Finish (LF)
        late_finish = {}
        late_start = {}
        
        def backward_pass(task_id, visited=None):
            if visited is None:
                visited = set()
            
            if task_id in visited:
                return late_finish.get(task_id, project_end)
            
            visited.add(task_id)
            task = task_map[task_id]
            
            # Get min late start of dependents
            dependent_late_starts = []
            for dep_id in dependents.get(task_id, []):
                if dep_id in task_map:
                    backward_pass(dep_id, visited.copy())
                    dep_ls = late_start.get(dep_id, project_end)
                    dependent_late_starts.append(dep_ls)
            
            # Late finish is min of dependent starts
            lf = min(dependent_late_starts) if dependent_late_starts else project_end
            duration = get_duration(task)
            ls = lf - duration
            
            late_finish[task_id] = lf
            late_start[task_id] = ls
            
            return lf
        
        # Process all tasks in reverse
        for task_id in reversed(list(task_map.keys())):
            backward_pass(task_id)
        
        # Calculate slack and identify critical path
        critical_path = []
        slack_times = {}
        
        for task_id, task_data in task_map.items():
            es = early_start.get(task_id, 0)
            ef = early_finish.get(task_id, 0)
            ls = late_start.get(task_id, project_end)
            lf = late_finish.get(task_id, project_end)
            
            # Total float (slack)
            total_float = ls - es  # or lf - ef (should be same)
            
            slack_times[task_id] = {
                'total_float': total_float,
                'early_start': es,
                'early_finish': ef,
                'late_start': ls,
                'late_finish': lf,
            }
            
            # Critical path: tasks with zero or near-zero float
            if total_float <= 1:
                critical_path.append({
                    'task_id': task_id,
                    'title': task_data.get('title', ''),
                    'total_float': total_float,
                    'duration': get_duration(task_data),
                })
        
        # Sort critical path by early start
        critical_path.sort(key=lambda x: slack_times[x['task_id']]['early_start'])
        
        return {
            'critical_path': critical_path,
            'slack_times': slack_times,
            'project_duration': project_end,
        }
    
    @staticmethod
    def predict_priority_changes(tasks: List[Dict], days_ahead: int = 7) -> List[Dict]:
        """
        Predict how priorities should change in the future.
        
        Args:
            tasks (List[Dict]): Current tasks
            days_ahead (int): Number of days to look ahead
            
        Returns:
            List[Dict]: Predicted priority changes
        """
        predictions = []
        future_date = datetime.now() + timedelta(days=days_ahead)
        
        for task in tasks:
            if task.get('status') == 'done':
                continue
            
            due_date = task.get('due_date')
            if not due_date:
                continue
            
            try:
                if isinstance(due_date, str):
                    due = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
                else:
                    due = due_date
                
                days_until = (due - datetime.now(due.tzinfo) if due.tzinfo else datetime.now()).days
                
                # Predict if task will become urgent
                if days_until <= days_ahead and days_until > 0:
                    current_priority = task.get('priority', 'medium')
                    
                    # Predict priority change
                    if days_until <= 2 and current_priority != 'high':
                        predictions.append({
                            'task_id': task.get('id'),
                            'task_title': task.get('title', ''),
                            'current_priority': current_priority,
                            'predicted_priority': 'high',
                            'days_until_due': days_until,
                            'reason': f'Task will be due in {days_until} days'
                        })
                    elif days_until <= 5 and current_priority == 'low':
                        predictions.append({
                            'task_id': task.get('id'),
                            'task_title': task.get('title', ''),
                            'current_priority': current_priority,
                            'predicted_priority': 'medium',
                            'days_until_due': days_until,
                            'reason': f'Task will be due in {days_until} days'
                        })
            except Exception:
                continue
        
        return predictions

