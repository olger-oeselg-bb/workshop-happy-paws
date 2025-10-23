import { defineStore } from 'pinia';
import { ref } from 'vue';
import { medicalRecordsApi } from '../api';
import { useUIStore } from './ui';

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
    const uiStore = useUIStore();
    loading.value = true;
    error.value = null;

    try {
      records.value = await medicalRecordsApi.fetchMedicalRecords(petId);
      return records.value;
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching medical records:', err);
      records.value = [];
      uiStore.showError(`Failed to load medical records: ${err.message}`);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createMedicalRecord(petId, recordData) {
    const uiStore = useUIStore();
    loading.value = true;
    error.value = null;

    try {
      const newRecord = await medicalRecordsApi.createMedicalRecord(petId, recordData);
      records.value.push(newRecord);
      uiStore.showSuccess('Medical record added successfully!');
      return newRecord;
    } catch (err) {
      error.value = err.message;
      console.error('Error creating medical record:', err);
      uiStore.showError(`Failed to add medical record: ${err.message}`);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateMedicalRecord(petId, recordId, changes) {
    const uiStore = useUIStore();
    loading.value = true;
    error.value = null;

    try {
      const updatedRecord = await medicalRecordsApi.updateMedicalRecord(petId, recordId, changes);

      // Update in list
      const index = records.value.findIndex(r => r.id === recordId);
      if (index !== -1) {
        records.value[index] = updatedRecord;
      }

      uiStore.showSuccess('Medical record updated successfully!');
      return updatedRecord;
    } catch (err) {
      error.value = err.message;
      console.error('Error updating medical record:', err);
      uiStore.showError(`Failed to update medical record: ${err.message}`);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteMedicalRecord(petId, recordId) {
    const uiStore = useUIStore();
    loading.value = true;
    error.value = null;

    try {
      await medicalRecordsApi.deleteMedicalRecord(petId, recordId);

      // Remove from list
      records.value = records.value.filter(r => r.id !== recordId);
      uiStore.showSuccess('Medical record deleted successfully!');
      return true;
    } catch (err) {
      error.value = err.message;
      console.error('Error deleting medical record:', err);
      uiStore.showError(`Failed to delete medical record: ${err.message}`);
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