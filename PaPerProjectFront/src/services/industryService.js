// Industry Service

import api from './api';

/**
 * List all industries
 */
export const listIndustries = async () => {
  try {
    const response = await api.get('/industries');
    return response;
  } catch (error) {
    console.error('List industries error:', error);
    throw error;
  }
};

/**
 * Get industry by slug
 */
export const getIndustryBySlug = async (slug) => {
  try {
    const response = await api.get(`/industries/${slug}`);
    return response;
  } catch (error) {
    console.error('Get industry error:', error);
    throw error;
  }
};

/**
 * Get industry challenges
 */
export const getIndustryChallenges = async (slug) => {
  try {
    const response = await api.get(`/industries/${slug}/challenges`);
    return response;
  } catch (error) {
    console.error('Get industry challenges error:', error);
    throw error;
  }
};

export default {
  listIndustries,
  getIndustryBySlug,
  getIndustryChallenges,
};

