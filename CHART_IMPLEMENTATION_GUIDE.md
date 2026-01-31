# Chart and Graph Implementation Guide

## Overview
The AI agents generate charts and graphs to visualize data and provide better insights. Charts are generated in the **backend** and displayed in the **frontend** using the `recharts` library.

## How Charts Are Generated

### 1. Backend Chart Generation

**Location**: `project_manager_agent/ai_agents/enhancements/chart_generation.py`

The `ChartGenerator` class provides static methods to generate chart data structures:

- `generate_priority_distribution_chart()` - Bar chart showing task priority distribution
- `generate_status_distribution_chart()` - Pie chart showing task status distribution
- `generate_priority_score_chart()` - Bar chart showing priority score ranges
- `generate_critical_path_chart()` - Gantt-style chart for critical path visualization
- `generate_insights_chart()` - Pie chart for insights breakdown
- `generate_workload_chart()` - Bar chart for team workload distribution

### 2. Agents That Generate Charts

#### Task Prioritization Agent
**File**: `project_manager_agent/ai_agents/task_prioritization_agent.py`

**When**: When `prioritize_tasks()` is called with a `context` parameter

**Charts Generated**:
- Priority Distribution (Bar Chart)
- Status Distribution (Pie Chart)
- Priority Scores (Bar Chart) - if priority scores are calculated
- Critical Path (Gantt Chart) - if critical path analysis is available

**Code Location**: Lines 77-95

#### Timeline/Gantt Agent
**File**: `project_manager_agent/ai_agents/timeline_gantt_agent.py`

**When**: When generating timelines or Gantt charts

**Charts Generated**:
- Status Distribution (Pie Chart)
- Priority Distribution (Bar Chart)
- Burndown Chart (Line Chart)
- Resource Utilization (Bar Chart)
- Gantt Timeline (Gantt Chart)
- Completion Rate (Progress Chart)

**Code Location**: `_generate_chart_data()` method (lines 1877-2006)

#### Knowledge QA Agent
**File**: `project_manager_agent/ai_agents/knowledge_qa_agent.py`

**When**: When generating insights or answering questions about project status

**Charts Generated**:
- Insights Breakdown (Pie Chart)
- Status Distribution (Pie Chart) - if analyzing tasks

**Code Location**: Lines 203-229

#### Analytics Dashboard Agent
**File**: `project_manager_agent/ai_agents/analytics_dashboard_agent.py`

**When**: When creating analytics dashboards

**Charts Generated**:
- Status Distribution (Pie Chart)
- Priority Distribution (Bar Chart)
- Priority Scores (Bar Chart)
- Health Score (Progress Chart)

**Code Location**: Lines 79-121

### 3. Chart Data Structure

Charts are returned as dictionaries with this structure:

```python
{
    'type': 'bar' | 'pie' | 'line' | 'gantt' | 'progress',
    'title': 'Chart Title',
    'xAxis': 'X-axis label',  # For bar/line charts
    'yAxis': 'Y-axis label',  # For bar/line charts
    'data': [
        {
            'name': 'Data Point Name',
            'value': 123,
            'color': '#hexcolor'
        },
        # ... more data points
    ],
    'total_tasks': 10,  # Optional metadata
}
```

### 4. How Charts Are Returned

Charts are included in the agent's response:

```python
# In prioritize_tasks() method
if context and 'charts' in context:
    return {
        'tasks': tasks,
        'charts': context['charts'],
        'critical_path_analysis': context.get('critical_path_analysis')
    }
```

The API endpoint wraps this in:
```python
return Response({
    "status": "success",
    "data": {
        "tasks": [...],
        "charts": {...},
        ...
    }
})
```

## How Charts Are Displayed

### Frontend Implementation

**Library Used**: `recharts` (React charting library)

**Location**: `PaPerProjectFront/src/components/pm-agent/`

### Components with Chart Display

#### 1. TimelineGanttAgent.jsx
**Status**: ✅ Fully implemented

**Charts Displayed**:
- Status Distribution (Pie Chart)
- Priority Distribution (Bar Chart)
- Burndown Chart (Line Chart)
- Resource Utilization (Bar Chart)
- Completion Rate (Progress Chart)
- Milestone Status (Pie Chart)

**Code Location**: Lines 187-360

#### 2. TaskPrioritizationAgent.jsx
**Status**: ✅ Just added chart display

**Charts Displayed**:
- Priority Distribution (Bar Chart)
- Status Distribution (Pie Chart)
- Priority Scores (Bar Chart)
- Critical Path (List/Visualization)

**Code Location**: Lines 187-280 (newly added)

### Chart Rendering Example

```jsx
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

// In component:
{result.data?.charts?.priority_distribution && (
  <Card>
    <CardHeader>
      <CardTitle>{result.data.charts.priority_distribution.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={result.data.charts.priority_distribution.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#3b82f6">
            {result.data.charts.priority_distribution.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)}
```

## Chart Types Supported

1. **Bar Charts** - For priority distribution, workload, resource utilization
2. **Pie Charts** - For status distribution, insights breakdown
3. **Line Charts** - For burndown charts, trends over time
4. **Gantt Charts** - For timeline visualization (currently displayed as list)
5. **Progress Charts** - For completion rates, health scores

## Data Flow

```
Backend Agent
    ↓
ChartGenerator.generate_*_chart()
    ↓
Charts added to context['charts']
    ↓
Returned in agent response
    ↓
API endpoint wraps in Response
    ↓
Frontend receives result.data.charts
    ↓
recharts components render charts
```

## Adding Charts to Other Agents

To add chart display to other agent components:

1. **Import recharts components**:
```jsx
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
```

2. **Extract charts from result**:
```jsx
const charts = result.data?.charts;
```

3. **Render charts conditionally**:
```jsx
{charts?.priority_distribution && (
  <Card>
    {/* Chart rendering code */}
  </Card>
)}
```

## Current Status

✅ **TimelineGanttAgent** - Fully implemented with all chart types
✅ **TaskPrioritizationAgent** - Just added chart display
❌ **KnowledgeQAAgent** - Charts generated but not displayed yet
❌ **AnalyticsDashboardAgent** - Charts generated but not displayed yet

## Next Steps

1. Add chart display to `KnowledgeQAAgent.jsx`
2. Add chart display to `AnalyticsDashboardAgent.jsx` (if component exists)
3. Enhance Gantt chart visualization (currently displayed as list)
4. Add interactive tooltips and legends to all charts

