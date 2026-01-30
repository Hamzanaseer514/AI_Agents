"""
Timeline/Gantt Agent Enhancements
Implements risk-based planning, Monte Carlo simulation, advanced scheduling
"""

from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta, date
import random
import math
import logging

logger = logging.getLogger(__name__)


class TimelineGanttEnhancements:
    """Enhancement methods for Timeline/Gantt Agent"""
    
    @staticmethod
    def generate_probabilistic_timeline(tasks: List[Dict], iterations: int = 1000) -> Dict:
        """
        Generate timeline with probability distributions using Monte Carlo simulation.
        
        Args:
            tasks (List[Dict]): Tasks with estimated durations
            iterations (int): Number of simulation iterations
            
        Returns:
            Dict: Probabilistic timeline with confidence intervals
        """
        if not tasks:
            return {
                'optimistic': 0,
                'realistic': 0,
                'pessimistic': 0,
                'expected': 0,
                'confidence_intervals': {}
            }
        
        # Run Monte Carlo simulation
        durations = []
        
        for _ in range(iterations):
            total_duration = 0
            
            for task in tasks:
                # Get base duration
                estimated_hours = task.get('estimated_hours', 0) or 0
                base_days = max(1, int(estimated_hours / 8)) if estimated_hours > 0 else 3
                
                # Add variability (PERT: optimistic, realistic, pessimistic)
                # Optimistic: 85% of base
                # Realistic: base
                # Pessimistic: 130% of base
                optimistic = base_days * 0.85
                realistic = base_days
                pessimistic = base_days * 1.3
                
                # Random duration between optimistic and pessimistic
                # Weighted towards realistic (beta distribution approximation)
                rand = random.random()
                if rand < 0.2:
                    duration = optimistic + (realistic - optimistic) * random.random()
                elif rand < 0.8:
                    duration = optimistic + (pessimistic - optimistic) * random.random() * 0.5
                else:
                    duration = realistic + (pessimistic - realistic) * random.random()
                
                total_duration += max(1, int(duration))
            
            durations.append(total_duration)
        
        # Calculate statistics
        durations.sort()
        
        optimistic_duration = durations[int(len(durations) * 0.1)]  # 10th percentile
        realistic_duration = durations[int(len(durations) * 0.5)]   # 50th percentile (median)
        pessimistic_duration = durations[int(len(durations) * 0.9)]  # 90th percentile
        expected_duration = sum(durations) / len(durations)
        
        return {
            'optimistic': optimistic_duration,
            'realistic': realistic_duration,
            'pessimistic': pessimistic_duration,
            'expected': int(expected_duration),
            'confidence_intervals': {
                '80%': {
                    'lower': durations[int(len(durations) * 0.1)],
                    'upper': durations[int(len(durations) * 0.9)]
                },
                '95%': {
                    'lower': durations[int(len(durations) * 0.025)],
                    'upper': durations[int(len(durations) * 0.975)]
                }
            },
            'simulation_iterations': iterations
        }
    
    @staticmethod
    def calculate_risk_buffers(tasks: List[Dict]) -> Dict:
        """
        Calculate risk buffers for tasks based on various risk factors.
        
        Args:
            tasks (List[Dict]): Tasks to analyze
            
        Returns:
            Dict: Risk buffer recommendations
        """
        risk_buffers = {}
        
        for task in tasks:
            task_id = task.get('id')
            buffer_days = 0
            
            # Factor 1: Priority (high priority = more buffer)
            priority = task.get('priority', 'medium')
            if priority == 'high':
                buffer_days += 2
            elif priority == 'medium':
                buffer_days += 1
            
            # Factor 2: Dependencies (more dependencies = more risk)
            dependencies = task.get('dependencies', [])
            buffer_days += len(dependencies) * 0.5
            
            # Factor 3: Complexity (estimated hours)
            estimated_hours = task.get('estimated_hours', 0) or 0
            if estimated_hours > 40:
                buffer_days += 3
            elif estimated_hours > 20:
                buffer_days += 2
            elif estimated_hours > 8:
                buffer_days += 1
            
            # Factor 4: Status (blocked tasks need more buffer)
            status = task.get('status', 'todo')
            if status == 'blocked':
                buffer_days += 2
            
            # Factor 5: Assignee workload (if overloaded, add buffer)
            # This would need context about assignee workload
            
            risk_buffers[task_id] = {
                'buffer_days': max(0, int(buffer_days)),
                'risk_level': 'high' if buffer_days >= 5 else ('medium' if buffer_days >= 2 else 'low'),
                'factors': {
                    'priority': priority,
                    'dependencies': len(dependencies),
                    'estimated_hours': estimated_hours,
                    'status': status,
                }
            }
        
        return risk_buffers
    
    @staticmethod
    def optimize_schedule(tasks: List[Dict], resources: List[Dict] = None) -> Dict:
        """
        Optimize schedule considering resource constraints.
        
        Args:
            tasks (List[Dict]): Tasks to schedule
            resources (List[Dict]): Available resources/users
            
        Returns:
            Dict: Optimized schedule
        """
        if not tasks:
            return {'optimized_tasks': [], 'improvements': []}
        
        # Simple optimization: balance workload
        optimized_tasks = []
        improvements = []
        
        if resources:
            # Calculate workload per resource
            workload = {}
            for resource in resources:
                resource_id = resource.get('id')
                workload[resource_id] = {
                    'tasks': [],
                    'total_hours': 0,
                }
            
            # Assign tasks to balance workload
            unassigned_tasks = []
            for task in tasks:
                assignee_id = task.get('assignee_id')
                if assignee_id and assignee_id in workload:
                    hours = task.get('estimated_hours', 0) or 0
                    workload[assignee_id]['tasks'].append(task)
                    workload[assignee_id]['total_hours'] += hours
                else:
                    unassigned_tasks.append(task)
            
            # Find average workload
            if workload:
                avg_hours = sum(w['total_hours'] for w in workload.values()) / len(workload)
                
                # Suggest redistributing from overloaded to underloaded
                for resource_id, data in workload.items():
                    if data['total_hours'] > avg_hours * 1.5:
                        improvements.append({
                            'type': 'workload_balance',
                            'resource_id': resource_id,
                            'current_hours': data['total_hours'],
                            'recommended_hours': avg_hours,
                            'message': f'Resource has {data["total_hours"]:.1f} hours, consider redistributing'
                        })
        
        # Sort tasks by priority and dependencies
        sorted_tasks = sorted(
            tasks,
            key=lambda t: (
                {'high': 0, 'medium': 1, 'low': 2}.get(t.get('priority', 'medium'), 1),
                len(t.get('dependencies', [])),
                t.get('due_date', '') or ''
            )
        )
        
        optimized_tasks = sorted_tasks
        
        return {
            'optimized_tasks': optimized_tasks,
            'improvements': improvements,
            'total_tasks': len(tasks),
        }
    
    @staticmethod
    def detect_schedule_conflicts(tasks: List[Dict]) -> List[Dict]:
        """
        Detect conflicts in the schedule.
        
        Args:
            tasks (List[Dict]): Tasks to analyze
            
        Returns:
            List[Dict]: Detected conflicts
        """
        conflicts = []
        
        # Group tasks by assignee
        assignee_tasks = {}
        for task in tasks:
            assignee_id = task.get('assignee_id')
            if assignee_id:
                if assignee_id not in assignee_tasks:
                    assignee_tasks[assignee_id] = []
                assignee_tasks[assignee_id].append(task)
        
        # Check for overlapping tasks for same assignee
        for assignee_id, user_tasks in assignee_tasks.items():
            if len(user_tasks) < 2:
                continue
            
            # Check each pair of tasks
            for i, task1 in enumerate(user_tasks):
                for task2 in user_tasks[i+1:]:
                    # Check if tasks overlap in time
                    due1 = task1.get('due_date')
                    due2 = task2.get('due_date')
                    
                    if due1 and due2:
                        try:
                            if isinstance(due1, str):
                                due1 = datetime.fromisoformat(due1.replace('Z', '+00:00'))
                            if isinstance(due2, str):
                                due2 = datetime.fromisoformat(due2.replace('Z', '+00:00'))
                            
                            # Calculate task windows
                            hours1 = task1.get('estimated_hours', 0) or 0
                            hours2 = task2.get('estimated_hours', 0) or 0
                            
                            start1 = due1 - timedelta(hours=hours1)
                            start2 = due2 - timedelta(hours=hours2)
                            
                            # Check overlap
                            if not (due1 < start2 or due2 < start1):
                                conflicts.append({
                                    'type': 'resource_overlap',
                                    'assignee_id': assignee_id,
                                    'task1_id': task1.get('id'),
                                    'task1_title': task1.get('title', ''),
                                    'task2_id': task2.get('id'),
                                    'task2_title': task2.get('title', ''),
                                    'severity': 'high' if hours1 + hours2 > 40 else 'medium',
                                    'message': f'Tasks "{task1.get("title", "")}" and "{task2.get("title", "")}" overlap'
                                })
                        except Exception:
                            pass
        
        return conflicts
    
    @staticmethod
    def coordinate_multi_project_schedules(projects: List[Dict]) -> Dict:
        """
        Coordinate schedules across multiple projects to optimize resource allocation.
        
        Args:
            projects (List[Dict]): List of projects with tasks
            
        Returns:
            Dict: Coordinated schedule with resource allocation
        """
        if not projects:
            return {'coordinated_schedule': [], 'resource_allocation': {}, 'conflicts': []}
        
        # Build resource timeline across all projects
        resource_timeline = {}  # {user_id: [(start, end, task_id, project_id), ...]}
        all_tasks = []
        
        for project in projects:
            project_id = project.get('id')
            tasks = project.get('tasks', [])
            
            for task in tasks:
                assignee_id = task.get('assignee_id')
                if not assignee_id:
                    continue
                
                # Calculate task time window
                due_date = task.get('due_date')
                estimated_hours = task.get('estimated_hours', 0) or 0
                
                if due_date:
                    try:
                        if isinstance(due_date, str):
                            due = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
                        else:
                            due = due_date
                        
                        start = due - timedelta(hours=estimated_hours)
                        
                        if assignee_id not in resource_timeline:
                            resource_timeline[assignee_id] = []
                        
                        resource_timeline[assignee_id].append({
                            'start': start,
                            'end': due,
                            'task_id': task.get('id'),
                            'task_title': task.get('title', ''),
                            'project_id': project_id,
                            'project_name': project.get('name', ''),
                            'hours': estimated_hours
                        })
                        
                        all_tasks.append({
                            'task_id': task.get('id'),
                            'task_title': task.get('title', ''),
                            'project_id': project_id,
                            'project_name': project.get('name', ''),
                            'assignee_id': assignee_id,
                            'start': start,
                            'end': due,
                            'hours': estimated_hours,
                            'priority': task.get('priority', 'medium')
                        })
                    except Exception:
                        pass
        
        # Detect conflicts across projects
        conflicts = []
        for assignee_id, tasks in resource_timeline.items():
            # Sort tasks by start time
            sorted_tasks = sorted(tasks, key=lambda x: x['start'])
            
            # Check for overlaps
            for i in range(len(sorted_tasks) - 1):
                task1 = sorted_tasks[i]
                task2 = sorted_tasks[i + 1]
                
                if task1['end'] > task2['start']:
                    conflicts.append({
                        'type': 'cross_project_conflict',
                        'assignee_id': assignee_id,
                        'task1': {
                            'id': task1['task_id'],
                            'title': task1['task_title'],
                            'project_id': task1['project_id'],
                            'project_name': task1['project_name'],
                            'start': task1['start'].isoformat(),
                            'end': task1['end'].isoformat()
                        },
                        'task2': {
                            'id': task2['task_id'],
                            'title': task2['task_title'],
                            'project_id': task2['project_id'],
                            'project_name': task2['project_name'],
                            'start': task2['start'].isoformat(),
                            'end': task2['end'].isoformat()
                        },
                        'overlap_hours': (task1['end'] - task2['start']).total_seconds() / 3600,
                        'severity': 'high' if (task1['hours'] + task2['hours']) > 40 else 'medium'
                    })
        
        # Calculate resource allocation
        resource_allocation = {}
        for assignee_id, tasks in resource_timeline.items():
            total_hours = sum(t['hours'] for t in tasks)
            resource_allocation[assignee_id] = {
                'total_tasks': len(tasks),
                'total_hours': total_hours,
                'projects': list(set(t['project_id'] for t in tasks)),
                'tasks': [{'id': t['task_id'], 'title': t['task_title'], 'project': t['project_name']} for t in tasks]
            }
        
        return {
            'coordinated_schedule': all_tasks,
            'resource_allocation': resource_allocation,
            'conflicts': conflicts,
            'total_projects': len(projects),
            'total_tasks': len(all_tasks)
        }
    
    @staticmethod
    def generate_what_if_scenarios(tasks: List[Dict], scenarios: List[str] = None) -> Dict:
        """
        Generate what-if scenario timelines for different conditions.
        
        Args:
            tasks (List[Dict]): Base tasks
            scenarios (List[str]): Scenario names (e.g., ['optimistic', 'pessimistic', 'delayed_dependencies'])
            
        Returns:
            Dict: Multiple scenario timelines
        """
        if not tasks:
            return {'scenarios': {}}
        
        if not scenarios:
            scenarios = ['optimistic', 'realistic', 'pessimistic', 'delayed_dependencies', 'resource_constrained']
        
        scenario_results = {}
        
        for scenario_name in scenarios:
            scenario_tasks = []
            
            for task in tasks:
                task_copy = task.copy()
                estimated_hours = task.get('estimated_hours', 0) or 0
                base_days = max(1, int(estimated_hours / 8)) if estimated_hours > 0 else 3
                
                if scenario_name == 'optimistic':
                    # 80% of estimated time
                    task_copy['scenario_hours'] = estimated_hours * 0.8
                    task_copy['scenario_days'] = max(1, int(base_days * 0.8))
                    task_copy['description'] = 'Optimistic: Everything goes smoothly'
                    
                elif scenario_name == 'realistic':
                    # 100% of estimated time
                    task_copy['scenario_hours'] = estimated_hours
                    task_copy['scenario_days'] = base_days
                    task_copy['description'] = 'Realistic: Normal execution'
                    
                elif scenario_name == 'pessimistic':
                    # 150% of estimated time
                    task_copy['scenario_hours'] = estimated_hours * 1.5
                    task_copy['scenario_days'] = max(1, int(base_days * 1.5))
                    task_copy['description'] = 'Pessimistic: Delays and issues occur'
                    
                elif scenario_name == 'delayed_dependencies':
                    # Add 2 days buffer for each dependency
                    dependencies = task.get('dependencies', [])
                    buffer_days = len(dependencies) * 2
                    task_copy['scenario_hours'] = estimated_hours + (buffer_days * 8)
                    task_copy['scenario_days'] = base_days + buffer_days
                    task_copy['description'] = f'Delayed Dependencies: {len(dependencies)} dependencies add {buffer_days} days'
                    
                elif scenario_name == 'resource_constrained':
                    # 120% of time if resource is overloaded
                    task_copy['scenario_hours'] = estimated_hours * 1.2
                    task_copy['scenario_days'] = max(1, int(base_days * 1.2))
                    task_copy['description'] = 'Resource Constrained: Limited availability'
                
                scenario_tasks.append(task_copy)
            
            # Calculate total duration for scenario
            total_days = sum(t.get('scenario_days', 0) for t in scenario_tasks)
            total_hours = sum(t.get('scenario_hours', 0) for t in scenario_tasks)
            
            scenario_results[scenario_name] = {
                'tasks': scenario_tasks,
                'total_duration_days': total_days,
                'total_duration_hours': total_hours,
                'task_count': len(scenario_tasks)
            }
        
        return {
            'scenarios': scenario_results,
            'base_tasks': tasks,
            'scenario_names': scenarios
        }
    
    @staticmethod
    def optimize_schedule_genetic_algorithm(tasks: List[Dict], resources: List[Dict] = None, 
                                           generations: int = 50, population_size: int = 20) -> Dict:
        """
        Optimize schedule using genetic algorithm approach.
        
        Args:
            tasks (List[Dict]): Tasks to schedule
            resources (List[Dict]): Available resources
            generations (int): Number of generations to evolve
            population_size (int): Size of population
            
        Returns:
            Dict: Optimized schedule
        """
        if not tasks:
            return {'optimized_tasks': [], 'fitness_score': 0}
        
        # Simple genetic algorithm for task ordering
        # Fitness function: minimize total project duration while respecting dependencies
        
        def calculate_fitness(task_order: List[int], task_map: Dict) -> float:
            """Calculate fitness: lower total duration = higher fitness"""
            if not task_order:
                return 0.0
            
            # Calculate total duration considering dependencies
            completed = set()
            total_duration = 0
            current_time = 0
            
            for task_id in task_order:
                task = task_map.get(task_id)
                if not task:
                    continue
                
                # Check dependencies
                deps = task.get('dependencies', [])
                if deps and not all(dep in completed for dep in deps):
                    # Dependencies not met, add penalty
                    total_duration += 1000  # Large penalty
                    continue
                
                # Add task duration
                hours = task.get('estimated_hours', 0) or 0
                days = max(1, int(hours / 8)) if hours > 0 else 3
                total_duration += days
                current_time += days
                completed.add(task_id)
            
            # Fitness is inverse of duration (higher is better)
            return 1.0 / (total_duration + 1)
        
        # Create task map
        task_map = {task.get('id'): task for task in tasks}
        task_ids = list(task_map.keys())
        
        if not task_ids:
            return {'optimized_tasks': [], 'fitness_score': 0}
        
        # Initialize population (random task orders)
        import random
        population = []
        for _ in range(population_size):
            individual = task_ids.copy()
            random.shuffle(individual)
            fitness = calculate_fitness(individual, task_map)
            population.append((individual, fitness))
        
        # Evolve population
        for generation in range(generations):
            # Sort by fitness
            population.sort(key=lambda x: x[1], reverse=True)
            
            # Keep top 50%
            elite_size = population_size // 2
            elite = population[:elite_size]
            
            # Generate new population
            new_population = elite.copy()
            
            while len(new_population) < population_size:
                # Crossover: take two parents from elite
                parent1 = random.choice(elite)[0]
                parent2 = random.choice(elite)[0]
                
                # Simple crossover: take first half from parent1, rest from parent2
                crossover_point = len(parent1) // 2
                child = parent1[:crossover_point]
                
                # Add remaining tasks from parent2 (not already in child)
                for task_id in parent2:
                    if task_id not in child:
                        child.append(task_id)
                
                # Mutation: swap two random tasks
                if random.random() < 0.1:  # 10% mutation rate
                    idx1, idx2 = random.sample(range(len(child)), 2)
                    child[idx1], child[idx2] = child[idx2], child[idx1]
                
                fitness = calculate_fitness(child, task_map)
                new_population.append((child, fitness))
            
            population = new_population
        
        # Get best solution
        population.sort(key=lambda x: x[1], reverse=True)
        best_order = population[0][0]
        best_fitness = population[0][1]
        
        # Build optimized task list
        optimized_tasks = []
        for task_id in best_order:
            if task_id in task_map:
                optimized_tasks.append(task_map[task_id])
        
        return {
            'optimized_tasks': optimized_tasks,
            'fitness_score': round(best_fitness, 4),
            'generations': generations,
            'optimization_method': 'genetic_algorithm'
        }
    
    @staticmethod
    def optimize_schedule_simulated_annealing(tasks: List[Dict], initial_temp: float = 100.0,
                                            cooling_rate: float = 0.95, iterations: int = 1000) -> Dict:
        """
        Optimize schedule using simulated annealing algorithm.
        
        Args:
            tasks (List[Dict]): Tasks to schedule
            initial_temp (float): Initial temperature
            cooling_rate (float): Temperature cooling rate
            iterations (int): Number of iterations
            
        Returns:
            Dict: Optimized schedule
        """
        if not tasks:
            return {'optimized_tasks': [], 'energy': float('inf')}
        
        import random
        
        def calculate_energy(task_order: List[int], task_map: Dict) -> float:
            """Calculate energy: lower is better (total duration + dependency violations)"""
            if not task_order:
                return float('inf')
            
            completed = set()
            total_duration = 0
            violations = 0
            
            for task_id in task_order:
                task = task_map.get(task_id)
                if not task:
                    continue
                
                # Check dependencies
                deps = task.get('dependencies', [])
                unmet_deps = [dep for dep in deps if dep not in completed]
                if unmet_deps:
                    violations += len(unmet_deps) * 10  # Penalty for violations
                
                # Add task duration
                hours = task.get('estimated_hours', 0) or 0
                days = max(1, int(hours / 8)) if hours > 0 else 3
                total_duration += days
                completed.add(task_id)
            
            return total_duration + violations
        
        # Create task map
        task_map = {task.get('id'): task for task in tasks}
        task_ids = list(task_map.keys())
        
        if not task_ids:
            return {'optimized_tasks': [], 'energy': float('inf')}
        
        # Initialize solution (random order)
        current_order = task_ids.copy()
        random.shuffle(current_order)
        current_energy = calculate_energy(current_order, task_map)
        
        best_order = current_order.copy()
        best_energy = current_energy
        
        temperature = initial_temp
        
        # Simulated annealing
        for iteration in range(iterations):
            # Generate neighbor: swap two random tasks
            neighbor = current_order.copy()
            idx1, idx2 = random.sample(range(len(neighbor)), 2)
            neighbor[idx1], neighbor[idx2] = neighbor[idx2], neighbor[idx1]
            
            neighbor_energy = calculate_energy(neighbor, task_map)
            
            # Accept if better or with probability based on temperature
            delta = neighbor_energy - current_energy
            if delta < 0 or random.random() < math.exp(-delta / temperature):
                current_order = neighbor
                current_energy = neighbor_energy
                
                # Update best if better
                if current_energy < best_energy:
                    best_order = current_order.copy()
                    best_energy = current_energy
            
            # Cool down
            temperature *= cooling_rate
        
        # Build optimized task list
        optimized_tasks = []
        for task_id in best_order:
            if task_id in task_map:
                optimized_tasks.append(task_map[task_id])
        
        return {
            'optimized_tasks': optimized_tasks,
            'energy': round(best_energy, 2),
            'iterations': iterations,
            'optimization_method': 'simulated_annealing'
        }

