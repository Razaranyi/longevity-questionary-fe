import axios from 'axios';
import { getCurrentUser } from './authService';

const API_URL = '/api/questions';

// Helper function to get auth header for protected routes
const authHeader = () => {
  const user = getCurrentUser();
  return user?.token ? { 'Authorization': `Bearer ${user.token}` } : {};
};

// Get active questions (public)
export const getActiveQuestions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching active questions:', error);
    throw error.response?.data || { message: 'Failed to fetch questions' };
  }
};

// Get question by order number (public)
export const getQuestionByOrderNumber = async (orderNumber) => {
  try {
    const response = await axios.get(`${API_URL}/order/${orderNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching question #${orderNumber}:`, error);
    throw error.response?.data || { message: 'Failed to fetch question' };
  }
};

// Admin functions (require authentication)

// Get all questions (including inactive ones)
export const getAllQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`, { 
      headers: authHeader() 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all questions:', error);
    throw error.response?.data || { message: 'Failed to fetch questions' };
  }
};

// Create a new question
export const createQuestion = async (questionData) => {
  try {
    const response = await axios.post(API_URL, questionData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error.response?.data || { message: 'Failed to create question' };
  }
};

// Update an existing question
export const updateQuestion = async (questionId, questionData) => {
  try {
    const response = await axios.put(`${API_URL}/${questionId}`, questionData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating question #${questionId}:`, error);
    throw error.response?.data || { message: 'Failed to update question' };
  }
};

// Toggle question active status
export const toggleQuestionStatus = async (questionId) => {
  try {
    const response = await axios.patch(`${API_URL}/${questionId}/toggle`, {}, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error toggling question #${questionId} status:`, error);
    throw error.response?.data || { message: 'Failed to toggle question status' };
  }
};

// Delete a question
export const deleteQuestion = async (questionId) => {
  try {
    const response = await axios.delete(`${API_URL}/${questionId}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting question #${questionId}:`, error);
    throw error.response?.data || { message: 'Failed to delete question' };
  }
}; 