// Consultation Service

import api from './api';

/**
 * Submit consultation request
 */
export const submitConsultation = async (consultationData) => {
  try {
    const response = await api.post('/consultations', {
      project_type: consultationData.projectType,
      requirements: consultationData.requirements,
      budget_range: consultationData.budgetRange,
      timeline: consultationData.timeline,
    });
    return response;
  } catch (error) {
    console.error('Submit consultation error:', error);
    throw error;
  }
};

export default {
  submitConsultation,
};

