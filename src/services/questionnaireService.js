import api from './api';

// Get all active questions
export const getActiveQuestions = async () => {
  try {
    const response = await api.get('/questions/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active questions:', error);
    throw error;
  }
};

// Get all questions (for admin)
export const getAllQuestions = async () => {
  try {
    const response = await api.get('/questions');
    return response.data;
  } catch (error) {
    console.error('Error fetching all questions:', error);
    throw error;
  }
};

// Get question by ID
export const getQuestionById = async (id) => {
  try {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching question ${id}:`, error);
    throw error;
  }
};

// Submit responses
export const submitResponses = async (responses) => {
  try {
    const response = await api.post('/responses', responses);
    return response.data;
  } catch (error) {
    console.error('Error submitting responses:', error);
    throw error;
  }
};

// Get analysis for a response
export const getAnalysis = async (responseId) => {
  try {
    const response = await api.get(`/analysis/${responseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching analysis for response ${responseId}:`, error);
    throw error;
  }
}; 