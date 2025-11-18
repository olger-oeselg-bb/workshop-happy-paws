import axios from 'axios';

/**
 * Shared HTTP utilities for API service layer
 * Provides common axios configuration with unified error handling
 */

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, status, statusText, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

const apiClient = axios.create({
  headers: {
    Accept: 'application/json'
  },
  withCredentials: false
});

function toApiError(error) {
  if (error.response) {
    const { status, statusText, data } = error.response;
    const message = data?.message || `HTTP ${status}: ${statusText}`;
    return new ApiError(message, status, statusText, data ?? null);
  }

  if (error.request) {
    return new ApiError('Network error occurred', 0, 'Network Error', null);
  }

  return new ApiError(error.message || 'Unexpected error occurred', 0, 'Error', null);
}

function withJsonHeaders(config = {}) {
  return {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...(config.headers || {})
    }
  };
}

/**
 * GET request wrapper
 * @param {string} url - The URL to fetch
 * @param {object} params - Query parameters
 * @param {object} config - Additional axios config overrides
 * @returns {Promise<object>} - Parsed JSON response
 */
export async function apiGet(url, params = {}, config = {}) {
  try {
    const response = await apiClient.get(url, { params, ...config });
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

/**
 * POST request wrapper
 * @param {string} url - The URL to post to
 * @param {object|FormData} data - Data to send in request body
 * @param {object} config - Additional axios config overrides
 * @returns {Promise<object>} - Parsed JSON response
 */
export async function apiPost(url, data = {}, config = {}) {
  const requestConfig = data instanceof FormData ? config : withJsonHeaders(config);
  try {
    const response = await apiClient.post(url, data, requestConfig);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

/**
 * PATCH request wrapper
 * @param {string} url - The URL to patch
 * @param {object} data - Data to send in request body
 * @param {object} config - Additional axios config overrides
 * @returns {Promise<object>} - Parsed JSON response
 */
export async function apiPatch(url, data = {}, config = {}) {
  try {
    const response = await apiClient.patch(url, data, withJsonHeaders(config));
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

/**
 * DELETE request wrapper
 * @param {string} url - The URL to delete
 * @param {object} config - Additional axios config overrides
 * @returns {Promise<object>} - Parsed JSON response
 */
export async function apiDelete(url, config = {}) {
  try {
    const response = await apiClient.delete(url, config);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export { apiClient };