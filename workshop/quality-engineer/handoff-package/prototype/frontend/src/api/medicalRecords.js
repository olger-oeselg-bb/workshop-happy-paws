import { apiGet, apiPost, apiPatch, apiDelete } from './http.js';

/**
 * Medical Records API Service
 * Handles all medical record-related API calls
 */
export class MedicalRecordsApiService {
  /**
   * Fetch all medical records for a pet
   * @param {string|number} petId - Pet ID
   * @returns {Promise<Array>} - Array of medical records
   */
  async fetchMedicalRecords(petId) {
    return apiGet(`/api/pets/${petId}/medical-records`);
  }

  /**
   * Create a new medical record for a pet
   * @param {string|number} petId - Pet ID
   * @param {object} recordData - Medical record data to create
   * @returns {Promise<object>} - Created medical record object
   */
  async createMedicalRecord(petId, recordData) {
    return apiPost(`/api/pets/${petId}/medical-records`, recordData);
  }

  /**
   * Update an existing medical record
   * @param {string|number} petId - Pet ID
   * @param {string|number} recordId - Medical record ID
   * @param {object} changes - Changes to apply
   * @returns {Promise<object>} - Updated medical record object
   */
  async updateMedicalRecord(petId, recordId, changes) {
    return apiPatch(`/api/pets/${petId}/medical-records/${recordId}`, changes);
  }

  /**
   * Delete a medical record
   * @param {string|number} petId - Pet ID
   * @param {string|number} recordId - Medical record ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteMedicalRecord(petId, recordId) {
    await apiDelete(`/api/pets/${petId}/medical-records/${recordId}`);
    return true;
  }
}

// Export singleton instance
export const medicalRecordsApi = new MedicalRecordsApiService();