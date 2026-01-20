// Contact Service

import api from './api';

/**
 * Submit contact form (supports file upload)
 * Always uses FormData to be compatible with multer middleware
 */
export const submitContactForm = async (formData, file = null) => {
  try {
    // Always use FormData for consistency with backend multer middleware
    const formDataToSend = new FormData();
    formDataToSend.append('fullName', formData.fullName || '');
    formDataToSend.append('email', formData.email || '');
    if (formData.phone) formDataToSend.append('phone', formData.phone);
    if (formData.projectTitle) formDataToSend.append('projectTitle', formData.projectTitle);
    formDataToSend.append('message', formData.message || '');
    
    // Only append file if it exists - use 'file' as field name (matches backend)
    if (file) {
      formDataToSend.append('file', file);
    }
    
    const response = await api.upload('/contact', formDataToSend);
    return response;
  } catch (error) {
    console.error('Submit contact form error:', error);
    throw error;
  }
};

/**
 * Submit complaint
 */
export const submitComplaint = async (complaintData) => {
  try {
    const response = await api.post('/contact/complaints', {
      complaintName: complaintData.name || null,
      complaintEmail: complaintData.email,
      complaintMessage: complaintData.message,
    });
    return response;
  } catch (error) {
    console.error('Submit complaint error:', error);
    throw error;
  }
};

/**
 * Get all contact messages (Admin only)
 */
export const getAllContactMessages = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = `/contact/admin${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    console.error('Get contact messages error:', error);
    throw error;
  }
};

/**
 * Get single contact message by ID (Admin only)
 */
export const getContactMessageById = async (id) => {
  try {
    const response = await api.get(`/contact/admin/${id}`);
    return response;
  } catch (error) {
    console.error('Get contact message error:', error);
    throw error;
  }
};

/**
 * Update contact message status (Admin only)
 */
export const updateContactMessageStatus = async (id, status) => {
  try {
    const response = await api.patch(`/contact/admin/${id}/status`, { status });
    return response;
  } catch (error) {
    console.error('Update contact message status error:', error);
    throw error;
  }
};

export default {
  submitContactForm,
  submitComplaint,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
};
