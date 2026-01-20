import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import pmAgentService from '@/services/pmAgentService';
import { Loader2, Send, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

const ProjectPilotAgent = ({ projects = [], onProjectUpdate }) => {
  const [question, setQuestion] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { toast } = useToast();
  
  // Ensure projects is always an array
  const safeProjects = Array.isArray(projects) ? projects : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a question or request',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      
      const projectId = selectedProjectId && selectedProjectId !== "all" ? selectedProjectId : null;
      const response = await pmAgentService.projectPilot(
        question,
        projectId
      );

      console.log('Project Pilot response:', response);
      
      if (response.status === 'success') {
        setResult(response);
        
        // Show success toast
        const actionResults = response.action_results || response.data?.action_results || [];
        if (actionResults.length > 0) {
          const successCount = actionResults.filter(r => r.success).length;
          if (successCount > 0) {
            toast({
              title: 'Success',
              description: `${successCount} action(s) completed successfully`,
            });
            // Refresh projects if any were created/updated
            if (onProjectUpdate) {
              onProjectUpdate();
            }
          }
        } else if (response.data?.answer || response.data?.cannot_do) {
          toast({
            title: 'Success',
            description: 'Request processed successfully',
          });
        }
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to process request',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Project Pilot error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process request',
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
            <Sparkles className="h-5 w-5 text-primary" />
            Project Pilot Agent
          </CardTitle>
          <CardDescription>
            Create projects, tasks, and manage operations using natural language.
            Example: "Create a new project called 'Website Redesign' with high priority"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Project (optional)
              </label>
              <Select value={selectedProjectId || "all"} onValueChange={(value) => setSelectedProjectId(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {safeProjects && safeProjects.length > 0 ? (
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

            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Request
              </label>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Create a new project called 'Mobile App Development' with deadline in 30 days, or Create 5 tasks for the current project..."
                rows={4}
                className="resize-none"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Answer */}
            {(result.data?.answer || result.answer) && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">AI Response:</p>
                <p className="whitespace-pre-wrap">{result.data?.answer || result.answer}</p>
              </div>
            )}

            {/* Action Results */}
            {(result.action_results || result.data?.action_results) && (result.action_results || result.data?.action_results).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Actions Taken:</p>
                {(result.action_results || result.data?.action_results).map((action, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      action.success
                        ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                        : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {action.success ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={action.success ? 'default' : 'destructive'}>
                            {action.action}
                          </Badge>
                          {action.success && (
                            <span className="text-sm text-muted-foreground">
                              {action.message || 'Completed successfully'}
                            </span>
                          )}
                        </div>
                        {action.error && (
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {action.error}
                          </p>
                        )}
                        {action.project_id && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Project ID: {action.project_id}
                          </p>
                        )}
                        {action.task_id && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Task ID: {action.task_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cannot Do Message */}
            {(result.data?.cannot_do || result.cannot_do) && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {result.data?.cannot_do || result.cannot_do}
                </p>
              </div>
            )}
            
            {/* Debug: Show raw response if no other content */}
            {!result.data?.answer && !result.answer && !result.action_results && !result.data?.action_results && !result.data?.cannot_do && !result.cannot_do && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Response received:</p>
                <pre className="text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectPilotAgent;



