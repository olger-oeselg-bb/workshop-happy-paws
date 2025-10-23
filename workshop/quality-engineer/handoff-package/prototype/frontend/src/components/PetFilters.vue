<template>
  <section class="filters" aria-label="Pet filters">
    <label class="field">
      <span class="field-label">Search</span>
      <input
        v-model.trim="localFilters.search"
        type="search"
        name="search"
        placeholder="Search by name"
        @input="syncFilters"
      />
    </label>

    <label class="field">
      <span class="field-label">Type</span>
      <select v-model="localFilters.type" name="type" @change="syncFilters">
        <option value="All">All</option>
        <option value="Dog">Dog</option>
        <option value="Cat">Cat</option>
        <option value="Other">Other</option>
      </select>
    </label>

    <label class="field">
      <span class="field-label">Status</span>
      <select v-model="localFilters.status" name="status" @change="syncFilters">
        <option value="All">All</option>
        <option value="In Shelter">In Shelter</option>
        <option value="Pending Adoption">Pending Adoption</option>
        <option value="Adopted">Adopted</option>
        <option value="Not Available">Not Available</option>
      </select>
    </label>

    <button class="reset" type="button" @click="resetAll">Reset filters</button>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { usePetsStore } from '@/stores';

const petsStore = usePetsStore();
const { filters } = storeToRefs(petsStore);

const localFilters = reactive({
  search: filters.value.search,
  type: filters.value.type,
  status: filters.value.status
});

function syncFilters() {
  petsStore.setFilters({
    search: localFilters.search,
    type: localFilters.type,
    status: localFilters.status
  });
}

function resetAll() {
  petsStore.resetFilters();
  Object.assign(localFilters, {
    search: '',
    type: 'All',
    status: 'All'
  });
}
</script>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 150px;
  flex: 1;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
}

.field input,
.field select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: #fff;
  transition: border-color 0.2s ease;
}

.field input:focus,
.field select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.reset {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: #fff;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.reset:hover {
  background-color: #f7fafc;
  border-color: #9ca3af;
}

.reset:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
</style>