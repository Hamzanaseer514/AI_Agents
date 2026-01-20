import { api } from './api';

/**
 * AI Predictor Service
 * Handles all AI prediction related API calls
 */
export const aiPredictorService = {
  /**
   * Get AI prediction based on form data
   * @param {Object} formData - Form data from AI predictor form
   * @returns {Promise<Object>} Prediction result with cost, duration, team size, etc.
   */
  async getPrediction(formData) {
    try {
      const response = await api.post('/ai-predictor', formData);
      console.log('AI Predictor API Response:', response);
      
      // Check if backend returned an error
      if (response && response.status === 'error') {
        console.error('❌ Backend returned error:', response.message);
        throw new Error(response.message || 'Server returned an error');
      }
      
      // Backend returns { status: 'success', message: '...', data: prediction }
      // Extract the prediction data from the response
      if (response && response.status === 'success' && response.data) {
        console.log('✅ Extracted prediction data:', response.data);
        return response.data;
      }
      
      // If response has prediction fields directly (backwards compatibility)
      if (response && (response.predictedCost !== undefined || response.predictedDuration)) {
        console.log('✅ Response contains prediction fields directly');
        return response;
      }
      
      // Fallback: return response if structure is different
      console.warn('⚠️ Unexpected response structure:', response);
      return response;
    } catch (error) {
      console.error('❌ AI Prediction Error:', error);
      // If error has a response with data, extract the message
      if (error.data && error.data.message) {
        throw new Error(error.data.message);
      }
      throw new Error(error.message || 'Failed to generate AI prediction');
    }
  },

  /**
   * Get all AI predictions (Admin only)
   */
  async getAllPredictions(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);

      const queryString = queryParams.toString();
      const endpoint = `/ai-predictor/admin${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error('Get AI predictions error:', error);
      throw error;
    }
  },

  /**
   * Get single AI prediction by ID (Admin only)
   */
  async getPredictionById(id) {
    try {
      const response = await api.get(`/ai-predictor/admin/${id}`);
      return response;
    } catch (error) {
      console.error('Get AI prediction error:', error);
      throw error;
    }
  },
};

export default aiPredictorService;

