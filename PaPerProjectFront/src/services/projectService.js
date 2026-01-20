// Project Service

import api from './api';

/**
 * List all projects with optional filtering
 */
export const listProjects = async (filters = {}) => {
  try {
    const response = await api.get('/projects', filters);
    return response;
  } catch (error) {
    console.error('List projects error:', error);
    throw error;
  }
};

/**
 * Get single project by ID
 */
export const getProject = async (id) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response;
  } catch (error) {
    console.error('Get project error:', error);
    throw error;
  }
};

/**
 * Create new project
 */
export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects', {
      title: projectData.title,
      description: projectData.description,
      industry_id: projectData.industryId,
      project_type: projectData.projectType,
      budget_min: projectData.budgetMin,
      budget_max: projectData.budgetMax,
      deadline: projectData.deadline,
      priority: projectData.priority || 'medium',
    });
    return response;
  } catch (error) {
    console.error('Create project error:', error);
    throw error;
  }
};

/**
 * Update project
 */
export const updateProject = async (id, projectData) => {
  try {
    const response = await api.put(`/projects/${id}`, projectData);
    return response;
  } catch (error) {
    console.error('Update project error:', error);
    throw error;
  }
};

/**
 * Delete project
 */
export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/projects/${id}`);
    return response;
  } catch (error) {
    console.error('Delete project error:', error);
    throw error;
  }
};

/**
 * Apply to project
 */
export const applyToProject = async (projectId, applicationData) => {
  try {
    const response = await api.post(`/projects/${projectId}/applications`, {
      proposal: applicationData.proposal,
      estimated_cost: applicationData.estimatedCost,
      estimated_duration: applicationData.estimatedDuration,
    });
    return response;
  } catch (error) {
    console.error('Apply to project error:', error);
    throw error;
  }
};

/**
 * Get project applications
 */
export const getProjectApplications = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/applications`);
    return response;
  } catch (error) {
    console.error('Get applications error:', error);
    throw error;
  }
};

export default {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  applyToProject,
  getProjectApplications,
};

