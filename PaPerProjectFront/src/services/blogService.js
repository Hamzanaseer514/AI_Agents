// Blog Service

import api from './api';

/**
 * List all blog posts
 */
export const listPosts = async (filters = {}) => {
  try {
    const response = await api.get('/blog/posts', filters);
    return response;
  } catch (error) {
    console.error('List blog posts error:', error);
    throw error;
  }
};

/**
 * Get blog post by slug
 */
export const getPostBySlug = async (slug) => {
  try {
    const response = await api.get(`/blog/posts/${slug}`);
    return response;
  } catch (error) {
    console.error('Get blog post error:', error);
    throw error;
  }
};

/**
 * Get blog tags
 */
export const getTags = async () => {
  try {
    const response = await api.get('/blog/tags');
    return response;
  } catch (error) {
    console.error('Get blog tags error:', error);
    throw error;
  }
};

/**
 * Get blog categories
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/blog/categories');
    return response;
  } catch (error) {
    console.error('Get blog categories error:', error);
    throw error;
  }
};

export default {
  listPosts,
  getPostBySlug,
  getTags,
  getCategories,
};

