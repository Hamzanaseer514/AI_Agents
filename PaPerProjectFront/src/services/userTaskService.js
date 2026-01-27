/**
 * User Task Service
 * Service for regular users to manage their tasks and projects
 */

import api from './api';

/**
 * Get all tasks assigned to the current user
 */
export const getMyTasks = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.project_id) queryParams.append('project_id', params.project_id);
    
    const queryString = queryParams.toString();
    const endpoint = `/user/tasks${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

/**
 * Get all projects where user has tasks
 */
export const getMyProjects = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const endpoint = `/user/projects${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * Update task status
 */
export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await api.patch(`/user/tasks/${taskId}/status`, { status });
    return response;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

/**
 * Update task progress percentage
 */
export const updateTaskProgress = async (taskId, progressPercentage) => {
  try {
    const response = await api.patch(`/user/tasks/${taskId}/progress`, { 
      progress_percentage: progressPercentage 
    });
    return response;
  } catch (error) {
    console.error('Error updating task progress:', error);
    throw error;
  }
};

export default {
  getMyTasks,
  getMyProjects,
  updateTaskStatus,
  updateTaskProgress,
};

