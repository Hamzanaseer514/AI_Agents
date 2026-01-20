// User Service

import api from './api';

/**
 * Get user profile
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/users/profile', profileData);
    return response;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/users/dashboard');
    return response;
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    throw error;
  }
};

export default {
  getProfile,
  updateProfile,
  getDashboardStats,
};

