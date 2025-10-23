import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Medical Records Store
 * Manages medical records data and operations
 */
export const useMedicalRecordsStore = defineStore('medicalRecords', () => {
  // State
  const records = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Actions
  async function fetchMedicalRecords(petId) {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`/api/pets/${petId}/medical-records`);

      if (!response.ok) {
        throw new Error(`Failed to fetch medical records: ${response.statusText}`);
      }

      records.value = await response.json();
      return records.value;
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching medical records:', err);
      records.value = [];
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createMedicalRecord(petId, recordData) {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`/api/pets/${petId}/medical-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create medical record: ${response.statusText}`);
      }

      const newRecord = await response.json();
      records.value.push(newRecord);
      return newRecord;
    } catch (err) {
      error.value = err.message;
      console.error('Error creating medical record:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateMedicalRecord(petId, recordId, changes) {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`/api/pets/${petId}/medical-records/${recordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes)
      });

      if (!response.ok) {
        throw new Error(`Failed to update medical record: ${response.statusText}`);
      }

      const updatedRecord = await response.json();

      // Update in list
      const index = records.value.findIndex(r => r.id === recordId);
      if (index !== -1) {
        records.value[index] = updatedRecord;
      }

      return updatedRecord;
    } catch (err) {
      error.value = err.message;
      console.error('Error updating medical record:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteMedicalRecord(petId, recordId) {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`/api/pets/${petId}/medical-records/${recordId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete medical record: ${response.statusText}`);
      }

      // Remove from list
      records.value = records.value.filter(r => r.id !== recordId);
      return true;
    } catch (err) {
      error.value = err.message;
      console.error('Error deleting medical record:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearRecords() {
    records.value = [];
    error.value = null;
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    records,
    loading,
    error,
    // Actions
    fetchMedicalRecords,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    clearRecords,
    clearError
  };
});