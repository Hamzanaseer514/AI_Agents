// Review Service

import api from './api';

/**
 * List all reviews
 */
export const listReviews = async (filters = {}) => {
  try {
    const response = await api.get('/reviews', filters);
    return response;
  } catch (error) {
    console.error('List reviews error:', error);
    throw error;
  }
};

/**
 * Get reviews summary
 */
export const getReviewsSummary = async () => {
  try {
    const response = await api.get('/reviews/summary');
    return response;
  } catch (error) {
    console.error('Get reviews summary error:', error);
    throw error;
  }
};

export default {
  listReviews,
  getReviewsSummary,
};

