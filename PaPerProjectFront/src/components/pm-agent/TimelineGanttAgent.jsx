import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import pmAgentService from '@/services/pmAgentService';
import { Loader2, Calendar, BarChart3, Clock, AlertCircle, Settings, Layers } from 'lucide-react';

const TimelineGanttAgent = ({ projects = [] }) => {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [action, setAction] = useState('create_timeline');
  const [daysAhead, setDaysAhead] = useState(7);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { toast } = useToast();
  
  // Ensure projects is always an array
  const safeProjects = Array.isArray(projects) ? projects : [];

  const actions = [
    { value: 'create_timeline', label: 'Create Timeline', icon: Calendar },
    { value: 'generate_gantt_chart', label: 'Generate Gantt Chart', icon: BarChart3 },
    { value: 'check_deadlines', label: 'Check Deadlines', icon: Clock },
    { value: 'suggest_adjustments', label: 'Suggest Adjustments', icon: Settings },
    { value: 'calculate_duration', label: 'Calculate Duration', icon: Layers },
    { value: 'manage_phases', label: 'Manage Phases', icon: Layers },
  ];

  const handleAction = async (selectedAction) => {
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
      setAction(selectedAction);

      const options = {};
      if (selectedAction === 'check_deadlines') {
        options.days_ahead = daysAhead;
      }

      const response = await pmAgentService.timelineGantt(
        selectedAction,
        selectedProjectId,
        options
      );

      if (response.status === 'success') {
        setResult(response);
        toast({
          title: 'Success',
          description: 'Timeline analysis completed',
        });
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to process timeline request',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Timeline/Gantt error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process timeline request',
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
            <Calendar className="h-5 w-5 text-primary" />
            Timeline & Gantt Agent
          </CardTitle>
          <CardDescription>
            Create timelines, generate Gantt charts, check deadlines, and manage project schedules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Project *
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

          {action === 'check_deadlines' && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Days Ahead
              </label>
              <Input
                type="number"
                value={daysAhead}
                onChange={(e) => setDaysAhead(parseInt(e.target.value) || 7)}
                min={1}
                max={365}
              />
            </div>
          )}

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
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Timeline Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Gantt Data */}
            {result.data?.gantt_data && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Gantt Chart Data:</p>
                {result.data.gantt_data.tasks && (
                  <div className="space-y-2">
                    {result.data.gantt_data.tasks.map((task, index) => (
                      <div
                        key={task.id || index}
                        className="p-3 border rounded-lg bg-card"
                      >
                        <p className="font-medium">{task.title}</p>
                        {task.start_date && task.end_date && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.start_date} - {task.end_date}
                          </p>
                        )}
                        {task.ai_reasoning && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {task.ai_reasoning}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Timeline */}
            {result.data?.timeline && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Timeline:</p>
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(result.data.timeline, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Deadline Warnings */}
            {result.data?.deadline_warnings && (
              <div className="space-y-3">
                <p className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Deadline Warnings:
                </p>
                {result.data.deadline_warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="p-3 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800"
                  >
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      {warning.task_title || 'Task'}
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      {warning.message || warning.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Adjustments */}
            {result.data?.adjustments && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Suggested Adjustments:</p>
                {result.data.adjustments.map((adjustment, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg bg-card"
                  >
                    <p className="font-medium">{adjustment.task_title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {adjustment.suggestion || adjustment.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* General Answer */}
            {result.data?.answer && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Analysis:</p>
                <p className="whitespace-pre-wrap text-sm">{result.data.answer}</p>
              </div>
            )}

            {/* Duration Calculation */}
            {result.data?.duration && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Estimated Duration: {result.data.duration}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimelineGanttAgent;



