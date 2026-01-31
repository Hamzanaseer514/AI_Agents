# Agent Enhancements Implementation Guide

This document explains how to integrate the new enhancement modules into the existing agents.

## Overview

All enhancements have been implemented in the `project_manager_agent/ai_agents/enhancements/` directory:

1. **ContextManager** - Unified context management
2. **ProjectPilotEnhancements** - Similar project detection, validation, smart assignment
3. **TaskPrioritizationEnhancements** - Multi-factor scoring, critical path analysis
4. **KnowledgeQAEnhancements** - Conversational memory, answer quality
5. **TimelineGanttEnhancements** - Risk-based planning, Monte Carlo simulation

## Integration Steps

### 1. Project Pilot Agent Integration

**File**: `project_manager_agent/ai_agents/project_pilot_agent.py`

Add these imports at the top:
```python
from .enhancements.project_pilot_enhancements import ProjectPilotEnhancements
from .context_manager import ContextManager
```

**In `handle_action_request` method**, add similar project detection:
```python
# Before processing creation request, check for similar projects
if is_creation_request and context:
    user_id = context.get('user_id') or (context.get('project', {}).get('owner_id'))
    if user_id:
        similar_projects = ProjectPilotEnhancements.analyze_similar_projects(
            question, user_id, limit=3
        )
        if similar_projects:
            # Add to context for AI to use as reference
            context['similar_projects'] = similar_projects
```

**Before creating tasks**, add validation:
```python
# Validate task before creation
is_valid, errors = ProjectPilotEnhancements.validate_task_creation(
    task_data, project
)
if not is_valid:
    return {
        'success': False,
        'error': f'Validation failed: {", ".join(errors)}',
        'validation_errors': errors
    }
```

**For smart assignment**, add after task creation:
```python
# Optimize assignments
if available_users:
    optimization = ProjectPilotEnhancements.optimize_assignments(
        created_tasks, available_users
    )
    # Use optimization suggestions
```

### 2. Task Prioritization Agent Integration

**File**: `project_manager_agent/ai_agents/task_prioritization_agent.py`

Add import:
```python
from .enhancements.task_prioritization_enhancements import TaskPrioritizationEnhancements
```

**Enhance `prioritize_tasks` method**:
```python
def prioritize_tasks(self, tasks: List[Dict], context: Optional[Dict] = None) -> List[Dict]:
    # ... existing code ...
    
    # Use multi-factor scoring
    for task in tasks:
        if context:
            priority_score = TaskPrioritizationEnhancements.calculate_priority_score(
                task, context
            )
            task['priority_score'] = priority_score
            
            # Convert score to priority level
            if priority_score >= 70:
                task['ai_priority'] = 'high'
            elif priority_score >= 40:
                task['ai_priority'] = 'medium'
            else:
                task['ai_priority'] = 'low'
    
    # Calculate critical path
    if context:
        critical_path_analysis = TaskPrioritizationEnhancements.calculate_critical_path(tasks)
        context['critical_path_analysis'] = critical_path_analysis
    
    return tasks
```

**Add predictive priority adjustment**:
```python
def predict_priority_changes(self, tasks: List[Dict], days_ahead: int = 7) -> List[Dict]:
    """Predict how priorities should change"""
    return TaskPrioritizationEnhancements.predict_priority_changes(tasks, days_ahead)
```

### 3. Knowledge QA Agent Integration

**File**: `project_manager_agent/ai_agents/knowledge_qa_agent.py`

Add import:
```python
from .enhancements.knowledge_qa_enhancements import KnowledgeQAEnhancements
```

**Enhance `answer_question` method**:
```python
def answer_question(self, question: str, context: Optional[Dict] = None, 
                   available_users: Optional[List[Dict]] = None,
                   session_id: Optional[str] = None) -> Dict:
    # Get conversation history
    conversation_context = ""
    if session_id:
        conversation_context = KnowledgeQAEnhancements.build_conversation_context(session_id)
    
    # ... existing prompt building ...
    prompt += conversation_context
    
    # Get answer
    answer = self._call_llm(prompt, self.system_prompt, temperature=0.7)
    
    # Enhance answer quality
    enhanced_answer = KnowledgeQAEnhancements.enhance_answer_quality(
        question, answer, context or {}
    )
    
    # Add to conversation history
    if session_id:
        KnowledgeQAEnhancements.add_to_conversation(
            session_id, question, answer, context
        )
    
    # Generate proactive insights
    insights = KnowledgeQAEnhancements.generate_proactive_insights(context or {})
    
    return {
        **enhanced_answer,
        'proactive_insights': insights
    }
```

### 4. Timeline/Gantt Agent Integration

**File**: `project_manager_agent/ai_agents/timeline_gantt_agent.py`

Add import:
```python
from .enhancements.timeline_gantt_enhancements import TimelineGanttEnhancements
```

**Enhance `generate_gantt_chart` method**:
```python
def generate_gantt_chart(self, project_id: int) -> Dict:
    # ... existing code ...
    
    # Add risk-based planning
    risk_buffers = TimelineGanttEnhancements.calculate_risk_buffers(gantt_data['tasks'])
    gantt_data['risk_buffers'] = risk_buffers
    
    # Generate probabilistic timeline
    probabilistic_timeline = TimelineGanttEnhancements.generate_probabilistic_timeline(
        gantt_data['tasks'], iterations=1000
    )
    gantt_data['probabilistic_timeline'] = probabilistic_timeline
    
    # Detect schedule conflicts
    conflicts = TimelineGanttEnhancements.detect_schedule_conflicts(gantt_data['tasks'])
    gantt_data['schedule_conflicts'] = conflicts
    
    return {
        'success': True,
        'gantt_chart': gantt_data
    }
```

**Add optimization method**:
```python
def optimize_schedule(self, project_id: int, resources: List[Dict] = None) -> Dict:
    """Optimize schedule with resource constraints"""
    project = Project.objects.get(id=project_id)
    tasks = Task.objects.filter(project=project)
    
    tasks_data = [{
        'id': t.id,
        'title': t.title,
        'estimated_hours': float(t.estimated_hours) if t.estimated_hours else None,
        'assignee_id': t.assignee.id if t.assignee else None,
        'priority': t.priority,
        'dependencies': [dep.id for dep in t.depends_on.all()],
    } for t in tasks]
    
    return TimelineGanttEnhancements.optimize_schedule(tasks_data, resources)
```

## Usage Examples

### Example 1: Using Context Manager

```python
from project_manager_agent.ai_agents.context_manager import ContextManager

# Get comprehensive project context
context = ContextManager.get_project_context(
    project_id=123,
    include_tasks=True,
    include_team=True,
    include_dependencies=True
)

# Use context in agent
agent = AgentRegistry.get_agent("project_pilot")
result = agent.process(question="Create tasks", context=context)
```

### Example 2: Similar Project Detection

```python
from project_manager_agent.ai_agents.enhancements import ProjectPilotEnhancements

# Find similar projects
similar = ProjectPilotEnhancements.analyze_similar_projects(
    project_description="E-commerce platform with payment integration",
    user_id=1,
    limit=3
)

# Use similar projects as templates
for similar_project in similar:
    print(f"Similar: {similar_project['project']['name']}")
    print(f"Tasks: {len(similar_project['tasks'])}")
```

### Example 3: Multi-factor Priority Scoring

```python
from project_manager_agent.ai_agents.enhancements import TaskPrioritizationEnhancements

task = {
    'id': 1,
    'title': 'Implement payment gateway',
    'due_date': '2026-02-01',
    'priority': 'medium',
    'dependencies': [2, 3],
    'dependent_count': 5,
}

context = {
    'critical_path': [{'task_id': 1}],
    'workload_analysis': {}
}

score = TaskPrioritizationEnhancements.calculate_priority_score(task, context)
print(f"Priority score: {score}")  # Output: e.g., 85.5
```

### Example 4: Conversational Memory

```python
from project_manager_agent.ai_agents.enhancements import KnowledgeQAEnhancements

# Answer with conversation context
session_id = "user_123_session"
answer = agent.answer_question(
    "What's the status?",
    context=context,
    session_id=session_id
)

# Next question remembers previous context
answer2 = agent.answer_question(
    "What about the tasks?",
    context=context,
    session_id=session_id  # Same session = remembers previous Q&A
)
```

### Example 5: Risk-based Timeline Planning

```python
from project_manager_agent.ai_agents.enhancements import TimelineGanttEnhancements

tasks = [
    {'id': 1, 'estimated_hours': 40, 'priority': 'high'},
    {'id': 2, 'estimated_hours': 20, 'priority': 'medium'},
]

# Generate probabilistic timeline
prob_timeline = TimelineGanttEnhancements.generate_probabilistic_timeline(
    tasks, iterations=1000
)

print(f"Optimistic: {prob_timeline['optimistic']} days")
print(f"Realistic: {prob_timeline['realistic']} days")
print(f"Pessimistic: {prob_timeline['pessimistic']} days")
```

## Testing

To test the enhancements:

1. **Test Context Manager**:
```python
python manage.py shell
>>> from project_manager_agent.ai_agents.context_manager import ContextManager
>>> context = ContextManager.get_project_context(1)
>>> print(context.keys())
```

2. **Test Similar Projects**:
```python
>>> from project_manager_agent.ai_agents.enhancements import ProjectPilotEnhancements
>>> similar = ProjectPilotEnhancements.analyze_similar_projects("E-commerce site", 1)
>>> print(similar)
```

3. **Test Priority Scoring**:
```python
>>> from project_manager_agent.ai_agents.enhancements import TaskPrioritizationEnhancements
>>> score = TaskPrioritizationEnhancements.calculate_priority_score(task, context)
>>> print(score)
```

## Performance Considerations

1. **Caching**: Context Manager uses Django cache (5 min TTL)
2. **Monte Carlo**: Default 1000 iterations (adjustable)
3. **Similar Projects**: Limited to 3 by default
4. **Conversation History**: Limited to 20 messages per session

## Next Steps

1. Integrate enhancements into main agent files
2. Add API endpoints for new features
3. Update frontend to use enhanced responses
4. Add monitoring and metrics
5. Collect user feedback for continuous improvement

## Notes

- All enhancements are backward compatible
- Existing functionality continues to work
- Enhancements can be enabled/disabled per agent
- Performance impact is minimal due to caching

