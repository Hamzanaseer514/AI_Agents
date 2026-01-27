import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import userTaskService from '@/services/userTaskService';
import DashboardNavbar from '@/components/common/DashboardNavbar';
import { 
  ListTodo, 
  FolderKanban, 
  Loader2, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2,
  Circle,
  PlayCircle,
  AlertCircle,
  FileCheck,
  TrendingUp
} from 'lucide-react';

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, isAuthenticated } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      toast({
        title: 'Not logged in',
        description: 'Please log in to access your dashboard',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    fetchTasks();
    fetchProjects();
  }, [statusFilter]);

  // Sync slider values when tasks are fetched
  useEffect(() => {
    const newSliderValues = {};
    tasks.forEach(task => {
      if (task.progress_percentage !== null && task.progress_percentage !== undefined) {
        newSliderValues[task.id] = task.progress_percentage;
      }
    });
    setSliderValues(newSliderValues);
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await userTaskService.getMyTasks(params);
      if (response.status === 'success') {
        setTasks(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load tasks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await userTaskService.getMyProjects();
      if (response.status === 'success') {
        setProjects(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Determine if we need to update progress based on status
      let progressUpdate = null;
      if (newStatus === 'done') {
        progressUpdate = 100;
      } else if (newStatus === 'todo') {
        progressUpdate = 0;
      }
      // For 'in_progress' and 'review', don't change progress
      // For 'blocked', don't change progress (slider will be disabled)
      
      // Update status (and progress if needed)
      const response = await userTaskService.updateTaskStatus(taskId, newStatus);
      if (response.status === 'success') {
        // If we need to update progress, do it
        if (progressUpdate !== null) {
          try {
            await userTaskService.updateTaskProgress(taskId, progressUpdate);
            // Update local state for both status and progress
            setTasks(prevTasks => 
              prevTasks.map(task => 
                task.id === taskId 
                  ? { ...task, status: newStatus, progress_percentage: progressUpdate }
                  : task
              )
            );
            setSliderValues(prev => ({
              ...prev,
              [taskId]: progressUpdate
            }));
          } catch (progressError) {
            console.error('Error updating progress:', progressError);
            // Status was updated, but progress update failed - still show success
          }
        } else {
          // Just update status
          setTasks(prevTasks => 
            prevTasks.map(task => 
              task.id === taskId 
                ? { ...task, status: newStatus }
                : task
            )
          );
        }
        
        toast({
          title: 'Success',
          description: progressUpdate !== null 
            ? 'Task status and progress updated successfully'
            : 'Task status updated successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update task status',
        variant: 'destructive',
      });
    }
  };

  // Local state for slider values to prevent glitching
  const [sliderValues, setSliderValues] = useState({});

  const handleProgressChange = (taskId, progress) => {
    // Update local state immediately for smooth slider movement
    setSliderValues(prev => ({
      ...prev,
      [taskId]: progress
    }));
    
    // Update tasks state for immediate UI feedback
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, progress_percentage: progress }
          : task
      )
    );
  };

  const handleProgressCommit = async (taskId, progress) => {
    // Only make API call when user releases the slider
    try {
      // Determine if we need to update status based on progress
      let statusUpdate = null;
      if (progress === 0) {
        statusUpdate = 'todo';
      } else if (progress === 100) {
        statusUpdate = 'done';
      } else if (progress > 0 && progress < 100) {
        // Only update to in_progress if current status is not blocked
        // Get current task to check status
        const currentTask = tasks.find(t => t.id === taskId);
        if (currentTask && currentTask.status !== 'blocked') {
          statusUpdate = 'in_progress';
        }
      }
      
      // Update progress first
      const progressResponse = await userTaskService.updateTaskProgress(taskId, progress);
      if (progressResponse.status === 'success') {
        // If we need to update status, do it
        if (statusUpdate !== null) {
          try {
            await userTaskService.updateTaskStatus(taskId, statusUpdate);
            // Update local state for both progress and status
            setTasks(prevTasks => 
              prevTasks.map(task => 
                task.id === taskId 
                  ? { ...task, progress_percentage: progress, status: statusUpdate }
                  : task
              )
            );
          } catch (statusError) {
            console.error('Error updating status:', statusError);
            // Progress was updated, but status update failed - still update progress
            setTasks(prevTasks => 
              prevTasks.map(task => 
                task.id === taskId 
                  ? { ...task, progress_percentage: progress }
                  : task
              )
            );
          }
        } else {
          // Just update progress
          setTasks(prevTasks => 
            prevTasks.map(task => 
              task.id === taskId 
                ? { ...task, progress_percentage: progress }
                : task
            )
          );
        }
      } else {
        // Revert on error
        fetchTasks();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update task progress',
        variant: 'destructive',
      });
      // Revert on error
      fetchTasks();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case 'review':
        return <FileCheck className="h-4 w-4 text-purple-600" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-purple-100 text-purple-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title>My Dashboard - Pay Per Project</title>
      </Helmet>

      <DashboardNavbar 
        user={user} 
        onLogout={handleLogout}
        showCompanyUserOptions={false}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your tasks and projects
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="tasks">
              <ListTodo className="h-4 w-4 mr-2" />
              My Tasks
            </TabsTrigger>
            <TabsTrigger value="projects">
              <FolderKanban className="h-4 w-4 mr-2" />
              My Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4 mt-6">
            {/* Status Filter */}
            <div className="flex items-center gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : tasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No tasks assigned</p>
                  <p className="text-sm text-muted-foreground">
                    {statusFilter !== 'all' 
                      ? `No tasks with status "${statusFilter}"`
                      : 'You don\'t have any tasks assigned yet'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{task.title}</CardTitle>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 items-center">
                            <Badge className={getStatusColor(task.status)}>
                              {getStatusIcon(task.status)}
                              <span className="ml-1 capitalize">{task.status.replace('_', ' ')}</span>
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority} Priority
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <FolderKanban className="h-4 w-4" />
                              {task.project_name}
                            </span>
                            {task.due_date && (
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(task.due_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">Progress</Label>
                          <span className="text-sm text-muted-foreground">
                            {sliderValues[task.id] !== undefined ? sliderValues[task.id] : (task.progress_percentage || 0)}%
                          </span>
                        </div>
                        <Slider
                          value={[sliderValues[task.id] !== undefined ? sliderValues[task.id] : (task.progress_percentage || 0)]}
                          onValueChange={(value) => {
                            // Only allow changes if status is not blocked
                            if (task.status !== 'blocked') {
                              handleProgressChange(task.id, value[0]);
                            }
                          }}
                          onValueCommit={(value) => {
                            // Only allow changes if status is not blocked
                            if (task.status !== 'blocked') {
                              handleProgressCommit(task.id, value[0]);
                            }
                          }}
                          max={100}
                          step={1}
                          className="w-full"
                          disabled={task.status === 'blocked'}
                        />
                      </div>

                      {/* Status Update */}
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium w-20">Status:</Label>
                        <Select
                          value={task.status}
                          onValueChange={(value) => handleStatusChange(task.id, value)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Subtasks */}
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium mb-2">Subtasks ({task.subtasks.length}):</p>
                          <div className="space-y-1">
                            {task.subtasks.map((subtask) => (
                              <div key={subtask.id} className="flex items-center gap-2 text-sm">
                                {subtask.status === 'done' ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Circle className="h-4 w-4 text-gray-400" />
                                )}
                                <span className={subtask.status === 'done' ? 'line-through text-muted-foreground' : ''}>
                                  {subtask.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-4 mt-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No projects assigned</p>
                  <p className="text-sm text-muted-foreground">
                    You don't have any projects assigned yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          {project.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {project.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline">{project.status}</Badge>
                            <Badge variant="secondary">{project.priority} Priority</Badge>
                            {project.my_task_count > 0 && (
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <ListTodo className="h-4 w-4" />
                                {project.my_task_count} task{project.my_task_count !== 1 ? 's' : ''}
                              </span>
                            )}
                            {project.completed_task_count > 0 && (
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                {project.completed_task_count} completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    {project.start_date && (
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {project.start_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Started: {new Date(project.start_date).toLocaleDateString()}
                            </span>
                          )}
                          {project.deadline && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Deadline: {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default UserDashboardPage;

