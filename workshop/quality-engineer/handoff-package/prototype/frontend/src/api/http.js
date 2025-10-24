/**
 * Shared HTTP utilities for API service layer
 * Provides common fetch logic with error handling and response processing
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

/**
 * Base fetch wrapper with common error handling
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - Parsed JSON response
 * @throws {ApiError} - When the response is not ok
 */
async function apiFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorData = null;

      try {
        // Try to parse error response as JSON
        errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If we can't parse as JSON, use the status text
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      throw new ApiError(errorMessage, response.status, response.statusText, errorData);
    }

    // For responses with no content (like 204 No Content)
    if (response.status === 204) {
      return null;
    }

    // Parse JSON response
    return await response.json();
  } catch (error) {
    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors, parsing errors, etc.
    throw new ApiError(
      error.message || 'Network error occurred',
      0,
      'Network Error',
      null
    );
  }
}

/**
 * GET request wrapper
 * @param {string} url - The URL to fetch
 * @param {object} params - Query parameters
 * @returns {Promise<object>} - Parsed JSON response
 */
export async function apiGet(url, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  return apiFetch(fullUrl, {
    method: 'GET'
  });
}

/**
 * POST request wrapper
 * @param {string} url - The URL to post to
 * @param {object} data - Data to send in request body
 * @returns {Promise<object>} - Parsed JSON response
 */
export async function apiPost(url, data = {}) {
  const isFormData = data instanceof FormData;
  return apiFetch(url, {
    method: 'POST',
    body: isFormData ? data : JSON.stringify(data),
    headers: isFormData ? {} : undefined // Let browser set Content-Type for FormData
  });
}

/**
 * PATCH request wrapper
 * @param {string} url - The URL to patch
 * @param {object} data - Data to send in request body
 * @returns {Promise<object>} - Parsed JSON response
 */
export async function apiPatch(url, data = {}) {
  return apiFetch(url, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

/**
 * DELETE request wrapper
 * @param {string} url - The URL to delete
 * @returns {Promise<object>} - Parsed JSON response
 */
export async function apiDelete(url) {
  return apiFetch(url, {
    method: 'DELETE'
  });
}