import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import pmAgentService from '@/services/pmAgentService';
import { Loader2, Target, ListChecks, AlertTriangle, Users } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const TaskPrioritizationAgent = ({ projects = [] }) => {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [action, setAction] = useState('prioritize');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { toast } = useToast();
  
  // Ensure projects is always an array
  const safeProjects = Array.isArray(projects) ? projects : [];

  const actions = [
    { value: 'prioritize', label: 'Prioritize Tasks', icon: Target },
    { value: 'order', label: 'Suggest Order', icon: ListChecks },
    { value: 'bottlenecks', label: 'Find Bottlenecks', icon: AlertTriangle },
    { value: 'delegation', label: 'Suggest Delegation', icon: Users },
  ];

  const handleAction = async (selectedAction) => {
    if (!selectedProjectId && projects.length > 0) {
      toast({
        title: 'Error',
        description: 'Please select a project',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setAction(selectedAction);

      const response = await pmAgentService.taskPrioritization(
        selectedAction,
        selectedProjectId || null
      );

      if (response.status === 'success') {
        setResult(response);
        toast({
          title: 'Success',
          description: 'Task analysis completed',
        });
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to analyze tasks',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Task Prioritization error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to analyze tasks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSubtasks = async () => {
    if (!selectedProjectId) {
      toast({
        title: 'Error',
        description: 'Please select a project',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await pmAgentService.generateSubtasks(selectedProjectId);

      if (response.status === 'success') {
        setResult(response);
        toast({
          title: 'Success',
          description: `Generated ${response.data?.saved_count || 0} subtasks`,
        });
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to generate subtasks',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Generate Subtasks error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate subtasks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Task Prioritization Agent
          </CardTitle>
          <CardDescription>
            Prioritize tasks, find bottlenecks, suggest order, and delegation strategies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Project
            </label>
            <Select value={selectedProjectId || "none"} onValueChange={setSelectedProjectId} disabled={safeProjects.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {safeProjects.length > 0 ? (
                  safeProjects.map((project) => (
                    <SelectItem key={project.id} value={String(project.id)}>
                      {project.title || project.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No projects available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {actions.map((actionItem) => {
              const Icon = actionItem.icon;
              return (
                <Button
                  key={actionItem.value}
                  variant={action === actionItem.value ? 'default' : 'outline'}
                  onClick={() => handleAction(actionItem.value)}
                  disabled={loading || !selectedProjectId}
                  className="justify-start"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {actionItem.label}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={handleGenerateSubtasks}
            disabled={loading || !selectedProjectId}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ListChecks className="h-4 w-4 mr-2" />
                Generate Subtasks
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Charts Section */}
            {result.data?.charts && (
              <div className="space-y-4 mb-6">
                {/* Priority Distribution Chart */}
                {result.data.charts.priority_distribution && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{result.data.charts.priority_distribution.title}</CardTitle>
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

                {/* Status Distribution Chart */}
                {result.data.charts.status_distribution && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{result.data.charts.status_distribution.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={result.data.charts.status_distribution.data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {result.data.charts.status_distribution.data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Priority Score Chart */}
                {result.data.charts.priority_scores && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{result.data.charts.priority_scores.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={result.data.charts.priority_scores.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#8b5cf6">
                            {result.data.charts.priority_scores.data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Critical Path Chart */}
                {result.data.charts.critical_path && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{result.data.charts.critical_path.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {result.data.charts.critical_path.total_tasks} critical path tasks
                        </p>
                        {result.data.charts.critical_path.data.map((cp, index) => (
                          <div key={index} className="p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                            <p className="font-medium">{cp.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Duration: {cp.duration} days | Float: {cp.total_float} days
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Tasks with priorities */}
            {result.data?.tasks && result.data.tasks.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Task Priorities:</p>
                {result.data.tasks.map((task, index) => (
                  <div
                    key={task.id || index}
                    className="p-3 border rounded-lg bg-card"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium">{task.title}</p>
                        {task.ai_priority && (
                          <Badge
                            variant={
                              task.ai_priority === 'high'
                                ? 'destructive'
                                : task.ai_priority === 'medium'
                                ? 'default'
                                : 'secondary'
                            }
                            className="mt-1"
                          >
                            {task.ai_priority.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {task.ai_reasoning && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {task.ai_reasoning}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Bottlenecks */}
            {result.data?.analysis?.bottlenecks && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Bottlenecks Found:</p>
                {result.data.analysis.bottlenecks.map((bottleneck, index) => (
                  <div
                    key={index}
                    className="p-3 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800"
                  >
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      {bottleneck.type}
                    </p>
                    {bottleneck.reasoning && (
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        {bottleneck.reasoning}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Delegation Suggestions */}
            {result.data?.suggestions?.suggestions && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Delegation Suggestions:</p>
                {result.data.suggestions.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg bg-card"
                  >
                    <p className="font-medium">Task #{suggestion.task_id}</p>
                    {suggestion.reasoning && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {suggestion.reasoning}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Subtask Generation Results */}
            {result.data?.saved_count !== undefined && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Generated {result.data.saved_count} subtasks successfully
                </p>
                {result.data.reasoning_updated_count > 0 && (
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Updated reasoning for {result.data.reasoning_updated_count} tasks
                  </p>
                )}
              </div>
            )}

            {/* General Answer */}
            {result.data?.answer && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Analysis:</p>
                <p className="whitespace-pre-wrap text-sm">{result.data.answer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskPrioritizationAgent;



