import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { petsApi } from '../api';

/**
 * Pets Store
 * Manages pet data, active pet details, and filtering
 */
export const usePetsStore = defineStore('pets', () => {
  // State
  const pets = ref([]);
  const activePet = ref(null);
  const filters = ref({
    search: '',
    type: 'All',
    status: 'All',
    breed: '',
    minAge: null,
    maxAge: null
  });
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const filteredPets = computed(() => {
    let result = pets.value;

    // Search filter
    if (filters.value.search) {
      const term = filters.value.search.toLowerCase();
      result = result.filter(pet => 
        pet.name?.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (filters.value.type && filters.value.type !== 'All') {
      result = result.filter(pet => pet.type === filters.value.type);
    }

    // Status filter
    if (filters.value.status && filters.value.status !== 'All') {
      result = result.filter(pet => pet.status === filters.value.status);
    }

    // Breed filter
    if (filters.value.breed) {
      const breed = filters.value.breed.toLowerCase();
      result = result.filter(pet => 
        pet.breed?.toLowerCase().includes(breed)
      );
    }

    // Age range filter
    if (filters.value.minAge !== null || filters.value.maxAge !== null) {
      result = result.filter(pet => {
        const age = Number(pet.age);
        if (isNaN(age)) return false;
        if (filters.value.minAge !== null && age < filters.value.minAge) return false;
        if (filters.value.maxAge !== null && age > filters.value.maxAge) return false;
        return true;
      });
    }

    return result;
  });

  const petCount = computed(() => pets.value.length);
  const filteredCount = computed(() => filteredPets.value.length);

  const petsByStatus = computed(() => {
    const statusCounts = {
      'In Shelter': 0,
      'Pending Adoption': 0,
      'Adopted': 0,
      'Not Available': 0
    };
    
    pets.value.forEach(pet => {
      if (pet.status && statusCounts.hasOwnProperty(pet.status)) {
        statusCounts[pet.status]++;
      }
    });
    
    return statusCounts;
  });

  // Actions
  async function fetchPets(queryParams = {}) {
    loading.value = true;
    error.value = null;

    try {
      pets.value = await petsApi.fetchPets(queryParams);
      return pets.value;
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching pets:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPetById(id) {
    loading.value = true;
    error.value = null;
    
    try {
      const pet = await petsApi.fetchPetById(id);
      activePet.value = pet;
      return pet;
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching pet:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createPet(petData) {
    loading.value = true;
    error.value = null;
    
    try {
      const newPet = await petsApi.createPet(petData);
      pets.value.push(newPet);
      return newPet;
    } catch (err) {
      error.value = err.message;
      console.error('Error creating pet:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updatePet(id, changes) {
    loading.value = true;
    error.value = null;
    
    try {
      const updatedPet = await petsApi.updatePet(id, changes);
      
      // Update in list
      const index = pets.value.findIndex(p => p.id === id);
      if (index !== -1) {
        pets.value[index] = updatedPet;
      }
      
      // Update active pet if it's the one being updated
      if (activePet.value?.id === id) {
        activePet.value = updatedPet;
      }
      
      return updatedPet;
    } catch (err) {
      error.value = err.message;
      console.error('Error updating pet:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters };
  }

  function resetFilters() {
    filters.value = {
      search: '',
      type: 'All',
      status: 'All',
      breed: '',
      minAge: null,
      maxAge: null
    };
  }

  function clearActivePet() {
    activePet.value = null;
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    pets,
    activePet,
    filters,
    loading,
    error,
    // Getters
    filteredPets,
    petCount,
    filteredCount,
    petsByStatus,
    // Actions
    fetchPets,
    fetchPetById,
    createPet,
    updatePet,
    setFilters,
    resetFilters,
    clearActivePet,
    clearError
  };
});
