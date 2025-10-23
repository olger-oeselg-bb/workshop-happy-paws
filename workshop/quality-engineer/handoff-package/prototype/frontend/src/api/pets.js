import { apiGet, apiPost, apiPatch } from './http.js';

/**
 * Pets API Service
 * Handles all pet-related API calls
 */
export class PetsApiService {
  /**
   * Fetch all pets with optional query parameters
   * @param {object} params - Query parameters (q, type, status, breed, minAge, maxAge)
   * @returns {Promise<Array>} - Array of pets
   */
  async fetchPets(params = {}) {
    return apiGet('/api/pets', params);
  }

  /**
   * Fetch a single pet by ID
   * @param {string|number} id - Pet ID
   * @returns {Promise<object>} - Pet object
   */
  async fetchPetById(id) {
    return apiGet(`/api/pets/${id}`);
  }

  /**
   * Create a new pet
   * @param {object} petData - Pet data to create
   * @returns {Promise<object>} - Created pet object
   */
  async createPet(petData) {
    return apiPost('/api/pets', petData);
  }

  /**
   * Update an existing pet
   * @param {string|number} id - Pet ID
   * @param {object} changes - Changes to apply
   * @returns {Promise<object>} - Updated pet object
   */
  async updatePet(id, changes) {
    return apiPatch(`/api/pets/${id}`, changes);
  }
}

// Export singleton instance
export const petsApi = new PetsApiService();