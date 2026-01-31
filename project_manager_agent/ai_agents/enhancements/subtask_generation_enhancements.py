"""
Subtask Generation Agent Enhancements
Implements domain-specific templates, adaptive granularity, dependency-aware subtasks
"""

from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class SubtaskGenerationEnhancements:
    """Enhancement methods for Subtask Generation Agent"""
    
    DOMAIN_TEMPLATES = {
        'software_development': {
            'phases': ['Planning & Design', 'Setup & Configuration', 'Implementation', 'Testing', 'Documentation'],
            'common_subtasks': [
                'Define requirements and specifications',
                'Set up development environment',
                'Create database schema/models',
                'Implement core functionality',
                'Write unit tests',
                'Code review and refactoring',
                'Integration testing',
                'Documentation and deployment'
            ]
        },
        'web_development': {
            'phases': ['Design', 'Frontend Development', 'Backend Development', 'Integration', 'Testing', 'Deployment'],
            'common_subtasks': [
                'Create wireframes/mockups',
                'Set up project structure',
                'Implement UI components',
                'Develop API endpoints',
                'Connect frontend to backend',
                'Cross-browser testing',
                'Performance optimization',
                'Deploy to production'
            ]
        },
        'mobile_app': {
            'phases': ['Design', 'UI/UX', 'Development', 'Testing', 'App Store Submission'],
            'common_subtasks': [
                'Create app design mockups',
                'Set up development environment',
                'Implement UI screens',
                'Develop app logic',
                'Device testing',
                'App store optimization',
                'Submit for review'
            ]
        },
        'marketing': {
            'phases': ['Research', 'Strategy', 'Content Creation', 'Distribution', 'Analysis'],
            'common_subtasks': [
                'Market research and analysis',
                'Define target audience',
                'Create content strategy',
                'Develop marketing materials',
                'Launch campaign',
                'Monitor performance',
                'Analyze results and optimize'
            ]
        },
        'database': {
            'phases': ['Design', 'Implementation', 'Migration', 'Optimization', 'Backup'],
            'common_subtasks': [
                'Design database schema',
                'Create tables and relationships',
                'Set up indexes',
                'Migrate existing data',
                'Optimize queries',
                'Set up backup strategy',
                'Documentation'
            ]
        },
    }
    
    @staticmethod
    def get_domain_template(task_description: str, project_type: str = None) -> Optional[Dict]:
        """
        Get domain-specific decomposition template.
        
        Args:
            task_description (str): Task description
            project_type (str): Project type (web_app, mobile_app, etc.)
            
        Returns:
            Dict: Domain template or None
        """
        desc_lower = task_description.lower()
        
        # Map project types to domains
        type_mapping = {
            'web_app': 'web_development',
            'mobile_app': 'mobile_app',
            'website': 'web_development',
            'ai_system': 'software_development',
            'database': 'database',
            'marketing': 'marketing',
        }
        
        domain = type_mapping.get(project_type, 'software_development')
        
        # Detect domain from description keywords
        if any(word in desc_lower for word in ['mobile', 'app', 'ios', 'android']):
            domain = 'mobile_app'
        elif any(word in desc_lower for word in ['web', 'website', 'frontend', 'backend']):
            domain = 'web_development'
        elif any(word in desc_lower for word in ['marketing', 'campaign', 'social media']):
            domain = 'marketing'
        elif any(word in desc_lower for word in ['database', 'sql', 'schema', 'tables']):
            domain = 'database'
        
        return SubtaskGenerationEnhancements.DOMAIN_TEMPLATES.get(domain)
    
    @staticmethod
    def determine_optimal_granularity(task: Dict, assignee: Dict = None) -> int:
        """
        Determine optimal number of subtasks based on complexity.
        
        Args:
            task (Dict): Task information
            assignee (Dict): Optional assignee information
            
        Returns:
            int: Optimal number of subtasks (4-12)
        """
        # Base granularity
        base_count = 5
        
        # Adjust based on estimated hours
        estimated_hours = task.get('estimated_hours', 0) or 0
        if estimated_hours > 40:
            base_count = 10
        elif estimated_hours > 20:
            base_count = 8
        elif estimated_hours > 10:
            base_count = 6
        elif estimated_hours < 4:
            base_count = 3
        
        # Adjust based on priority
        priority = task.get('priority', 'medium')
        if priority == 'high':
            base_count += 1  # More granular for high priority
        
        # Adjust based on description length (complexity indicator)
        description = task.get('description', '')
        if len(description) > 500:
            base_count += 2
        elif len(description) > 200:
            base_count += 1
        
        # Adjust based on assignee skill level (if available)
        if assignee:
            # Beginner might need more granular breakdown
            # This would need skill level data
            pass
        
        return min(12, max(3, base_count))
    
    @staticmethod
    def identify_subtask_dependencies(subtasks: List[Dict]) -> Dict:
        """
        Identify dependencies between subtasks.
        
        Args:
            subtasks (List[Dict]): List of subtasks
            
        Returns:
            Dict: Dependency graph and parallel opportunities
        """
        dependencies = {}
        parallel_groups = []
        
        # Simple heuristic: earlier subtasks are dependencies for later ones
        # More sophisticated analysis would use NLP to detect dependencies
        
        for i, subtask in enumerate(subtasks):
            subtask_id = subtask.get('order', i + 1)
            deps = []
            
            # Subtasks with lower order are dependencies
            for j, other_subtask in enumerate(subtasks):
                other_order = other_subtask.get('order', j + 1)
                if other_order < subtask_id:
                    deps.append(other_order)
            
            dependencies[subtask_id] = deps
        
        # Identify parallel opportunities (subtasks with no dependencies)
        parallel_opportunities = []
        for subtask_id, deps in dependencies.items():
            if not deps:
                parallel_opportunities.append(subtask_id)
        
        return {
            'dependencies': dependencies,
            'parallel_opportunities': parallel_opportunities,
            'critical_path': list(range(1, len(subtasks) + 1)),  # Simplified
        }
    
    @staticmethod
    def add_quality_gates(subtasks: List[Dict]) -> List[Dict]:
        """
        Add quality checkpoints and acceptance criteria to subtasks.
        
        Args:
            subtasks (List[Dict]): List of subtasks
            
        Returns:
            List[Dict]: Subtasks with quality gates
        """
        enhanced_subtasks = []
        
        for i, subtask in enumerate(subtasks):
            enhanced = subtask.copy()
            
            # Add acceptance criteria based on subtask type
            title_lower = subtask.get('title', '').lower()
            
            if any(word in title_lower for word in ['test', 'testing', 'verify']):
                enhanced['acceptance_criteria'] = [
                    'All test cases pass',
                    'Code coverage meets requirements',
                    'No critical bugs found'
                ]
                enhanced['quality_gate'] = True
            elif any(word in title_lower for word in ['review', 'approval']):
                enhanced['acceptance_criteria'] = [
                    'Code/documentation reviewed',
                    'Approved by team lead',
                    'Meets quality standards'
                ]
                enhanced['quality_gate'] = True
            elif any(word in title_lower for word in ['deploy', 'deployment', 'release']):
                enhanced['acceptance_criteria'] = [
                    'All tests pass',
                    'Documentation complete',
                    'Deployed to production',
                    'Smoke tests successful'
                ]
                enhanced['quality_gate'] = True
            else:
                enhanced['acceptance_criteria'] = [
                    'Subtask completed as specified',
                    'Meets acceptance criteria'
                ]
                enhanced['quality_gate'] = False
            
            enhanced_subtasks.append(enhanced)
        
        return enhanced_subtasks

