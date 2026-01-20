// Applicant Service

import api from './api';

/**
 * Get application status by token
 */
export const getApplicationStatus = async (token) => {
  try {
    const response = await api.get('/applicant/status', { token });
    return response;
  } catch (error) {
    console.error('Get application status error:', error);
    throw error;
  }
};

export default {
  getApplicationStatus,
};

