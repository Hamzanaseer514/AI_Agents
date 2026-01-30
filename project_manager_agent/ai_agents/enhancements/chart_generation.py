"""
Chart Generation Utilities
Shared chart generation functions for all agents
"""

from typing import Dict, List
from collections import defaultdict
from datetime import datetime, timedelta


class ChartGenerator:
    """Utility class for generating chart data structures"""
    
    @staticmethod
    def generate_priority_distribution_chart(tasks: List[Dict]) -> Dict:
        """
        Generate priority distribution bar chart data.
        
        Args:
            tasks (List[Dict]): List of tasks
            
        Returns:
            Dict: Chart data structure
        """
        priority_counts = defaultdict(int)
        priority_scores = defaultdict(list)
        
        for task in tasks:
            priority = task.get('priority', 'medium')
            priority_counts[priority] += 1
            
            # Collect priority scores if available
            if 'priority_score' in task:
                priority_scores[priority].append(task['priority_score'])
        
        # Calculate average scores
        avg_scores = {}
        for priority, scores in priority_scores.items():
            avg_scores[priority] = sum(scores) / len(scores) if scores else 0
        
        return {
            'type': 'bar',
            'title': 'Task Priority Distribution',
            'xAxis': 'Priority Level',
            'yAxis': 'Number of Tasks',
            'data': [
                {
                    'name': 'High',
                    'value': priority_counts.get('high', 0),
                    'color': '#ef4444',
                    'average_score': round(avg_scores.get('high', 0), 2)
                },
                {
                    'name': 'Medium',
                    'value': priority_counts.get('medium', 0),
                    'color': '#f59e0b',
                    'average_score': round(avg_scores.get('medium', 0), 2)
                },
                {
                    'name': 'Low',
                    'value': priority_counts.get('low', 0),
                    'color': '#10b981',
                    'average_score': round(avg_scores.get('low', 0), 2)
                },
            ],
            'total_tasks': len(tasks)
        }
    
    @staticmethod
    def generate_priority_score_chart(tasks: List[Dict]) -> Dict:
        """
        Generate priority score distribution chart.
        
        Args:
            tasks (List[Dict]): List of tasks with priority scores
            
        Returns:
            Dict: Chart data structure
        """
        # Group tasks by score ranges
        score_ranges = {
            '0-20': [],
            '21-40': [],
            '41-60': [],
            '61-80': [],
            '81-100': []
        }
        
        for task in tasks:
            score = task.get('priority_score', 0)
            if score <= 20:
                score_ranges['0-20'].append(task)
            elif score <= 40:
                score_ranges['21-40'].append(task)
            elif score <= 60:
                score_ranges['41-60'].append(task)
            elif score <= 80:
                score_ranges['61-80'].append(task)
            else:
                score_ranges['81-100'].append(task)
        
        return {
            'type': 'bar',
            'title': 'Priority Score Distribution',
            'xAxis': 'Score Range',
            'yAxis': 'Number of Tasks',
            'data': [
                {
                    'name': range_name,
                    'value': len(tasks),
                    'color': '#3b82f6' if int(range_name.split('-')[0]) >= 60 else '#6b7280'
                }
                for range_name, tasks in score_ranges.items()
            ]
        }
    
    @staticmethod
    def generate_critical_path_chart(critical_path: List[Dict]) -> Dict:
        """
        Generate critical path visualization chart.
        
        Args:
            critical_path (List[Dict]): Critical path tasks
            
        Returns:
            Dict: Chart data structure
        """
        return {
            'type': 'gantt',
            'title': 'Critical Path Visualization',
            'data': [
                {
                    'task_id': cp.get('task_id'),
                    'title': cp.get('title', ''),
                    'duration': cp.get('duration', 0),
                    'total_float': cp.get('total_float', 0),
                    'is_critical': True
                }
                for cp in critical_path
            ],
            'total_tasks': len(critical_path),
            'project_duration': critical_path[-1].get('late_finish') if critical_path else None
        }
    
    @staticmethod
    def generate_status_distribution_chart(tasks: List[Dict]) -> Dict:
        """
        Generate task status distribution pie chart.
        
        Args:
            tasks (List[Dict]): List of tasks
            
        Returns:
            Dict: Chart data structure
        """
        status_counts = defaultdict(int)
        for task in tasks:
            status = task.get('status', 'todo')
            status_counts[status] += 1
        
        return {
            'type': 'pie',
            'title': 'Task Status Distribution',
            'data': [
                {'name': 'Done', 'value': status_counts.get('done', 0), 'color': '#10b981'},
                {'name': 'In Progress', 'value': status_counts.get('in_progress', 0), 'color': '#3b82f6'},
                {'name': 'Review', 'value': status_counts.get('review', 0), 'color': '#f59e0b'},
                {'name': 'Blocked', 'value': status_counts.get('blocked', 0), 'color': '#ef4444'},
                {'name': 'To Do', 'value': status_counts.get('todo', 0), 'color': '#6b7280'},
            ],
            'total_tasks': len(tasks)
        }
    
    @staticmethod
    def generate_insights_chart(insights: List[Dict]) -> Dict:
        """
        Generate insights visualization chart.
        
        Args:
            insights (List[Dict]): List of insights
            
        Returns:
            Dict: Chart data structure
        """
        insight_types = defaultdict(int)
        for insight in insights:
            insight_type = insight.get('type', 'info')
            insight_types[insight_type] += 1
        
        return {
            'type': 'pie',
            'title': 'Insights by Type',
            'data': [
                {'name': 'Warning', 'value': insight_types.get('warning', 0), 'color': '#ef4444'},
                {'name': 'Suggestion', 'value': insight_types.get('suggestion', 0), 'color': '#f59e0b'},
                {'name': 'Info', 'value': insight_types.get('info', 0), 'color': '#3b82f6'},
            ],
            'total_insights': len(insights)
        }
    
    @staticmethod
    def generate_workload_chart(workload_data: Dict) -> Dict:
        """
        Generate workload distribution chart.
        
        Args:
            workload_data (Dict): Workload analysis data
            
        Returns:
            Dict: Chart data structure
        """
        workload_by_user = workload_data.get('workload_by_user', {})
        
        return {
            'type': 'bar',
            'title': 'Team Workload Distribution',
            'xAxis': 'Team Member',
            'yAxis': 'Active Tasks',
            'data': [
                {
                    'name': data['user'].get('username', 'Unknown'),
                    'tasks': data['active_tasks'],
                    'hours': round(data['total_hours'], 1),
                    'color': '#ef4444' if data['active_tasks'] >= 10 else ('#f59e0b' if data['active_tasks'] >= 5 else '#10b981')
                }
                for user_id, data in workload_by_user.items()
            ]
        }

