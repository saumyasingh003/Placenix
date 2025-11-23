// Model Layer - API Service for Cover Letter Operations
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/coverletter";

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  return currentUser.token || "";
};

/**
 * Generate a new cover letter
 * @param {Object} data - { companyName, jobTitle, jobDescription }
 * @returns {Promise} API response
 */
export const generateCoverLetter = async (data) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_BASE_URL}/generate`,
      {
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to generate cover letter",
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Get all cover letters for the current user
 * @returns {Promise} API response with cover letters array
 */
export const getAllCoverLetters = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch cover letters",
      data: [],
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Get a single cover letter by ID
 * @param {string} id - Cover letter ID
 * @returns {Promise} API response with cover letter data
 */
export const getCoverLetterById = async (id) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch cover letter",
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Delete a cover letter by ID
 * @param {string} id - Cover letter ID
 * @returns {Promise} API response
 */
export const deleteCoverLetter = async (id) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      message: response.data.message || "Cover letter deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete cover letter",
      error: error.response?.data?.error || error.message,
    };
  }
};








