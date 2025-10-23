<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-copy">
        <h2 class="hero-title">Discover adoptable pets</h2>
        <p class="hero-body">
          Browse the shelter roster, refine the list with filters, and jump straight into a pet profile.
        </p>
      </div>
      <router-link class="primary-action" :to="{ name: 'add-pet' }" aria-label="Add a new pet">
        Add Pet
      </router-link>
    </section>

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

    <section class="inventory" aria-live="polite">
      <header class="inventory-header">
        <div>
          <h3 class="inventory-title">Shelter inventory</h3>
          <p class="inventory-subtitle">{{ filteredCount }} of {{ petCount }} pets shown</p>
        </div>
        <button class="link" type="button" :disabled="loading" @click="refresh">
          {{ loading ? 'Refreshing…' : 'Refresh list' }}
        </button>
      </header>

      <p v-if="error" class="state state-error">
        {{ error }}
        <button class="link" type="button" @click="refresh">Try again</button>
      </p>

      <p v-else-if="loading" class="state">Loading pets…</p>

      <p v-else-if="!filteredPets.length" class="state">No pets match the selected filters.</p>

      <ul v-else class="pet-grid">
        <li
          v-for="pet in filteredPets"
          :key="pet.id"
          class="pet-card"
        >
          <figure class="pet-photo">
            <img :src="pet.photoUrl || placeholderImage" :alt="pet.name" loading="lazy" />
          </figure>
          <div class="pet-body">
            <header class="pet-header">
              <h4>{{ pet.name }}</h4>
              <span :class="['status-badge', statusClass(pet.status)]">{{ pet.status }}</span>
            </header>
            <p class="pet-meta">{{ pet.type }} • {{ pet.breed || 'Unknown breed' }}</p>
            <router-link
              class="pet-link"
              :to="{ name: 'pet-profile', params: { id: pet.id } }"
            >
              View profile
            </router-link>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { usePetsStore, useUIStore } from '@/stores';

const petsStore = usePetsStore();
const uiStore = useUIStore();

const { filteredPets, petCount, filteredCount, loading, error, filters } = storeToRefs(petsStore);

const localFilters = reactive({
  search: filters.value.search,
  type: filters.value.type,
  status: filters.value.status
});

const placeholderImage = '/images/placeholder.svg';

function syncFilters() {
  petsStore.setFilters({
    search: localFilters.search,
    type: localFilters.type,
    status: localFilters.status
  });
}

async function refresh() {
  try {
    await petsStore.fetchPets();
    uiStore.showSuccess('Pet list refreshed');
  } catch (err) {
    uiStore.showError(err.message || 'Unable to refresh pets');
  }
}

function resetAll() {
  petsStore.resetFilters();
  Object.assign(localFilters, {
    search: '',
    type: 'All',
    status: 'All'
  });
}

function statusClass(status) {
  switch (status) {
    case 'In Shelter':
      return 'status-in-shelter';
    case 'Pending Adoption':
      return 'status-pending';
    case 'Adopted':
      return 'status-adopted';
    case 'Not Available':
      return 'status-unavailable';
    default:
      return 'status-default';
  }
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-block: 1rem;
}

.hero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.18));
}

.hero-title {
  margin: 0;
  font-size: 1.75rem;
  color: #2c3e50;
}

.hero-body {
  margin: 0.5rem 0 0;
  max-width: 520px;
  color: #4a5568;
}

.primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.5rem;
  border-radius: 999px;
  background-color: #667eea;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(102, 126, 234, 0.3);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  background: #ffffff;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.08);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #4a5568;
}

input,
select {
  padding: 0.6rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  min-width: 12rem;
}

.reset {
  margin-left: auto;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid transparent;
  background: #f3f4f6;
  font-weight: 600;
  cursor: pointer;
}

.reset:hover {
  background: #e5e7eb;
}

.inventory {
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.08);
}

.inventory-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.inventory-title {
  margin: 0;
  color: #1f2937;
}

.inventory-subtitle {
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.link {
  background: none;
  border: none;
  padding: 0;
  font-weight: 600;
  color: #4c51bf;
  cursor: pointer;
}

.link:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.state {
  margin: 1.25rem 0;
  color: #4b5563;
}

.state-error {
  color: #b91c1c;
}

.pet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 0;
}

.pet-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  min-height: 260px;
}

.pet-photo {
  margin: 0;
  aspect-ratio: 4 / 3;
  background: #e5e7eb;
}

.pet-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pet-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  flex: 1;
}

.pet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.pet-meta {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.pet-link {
  margin-top: auto;
  text-decoration: none;
  font-weight: 600;
  color: #4c51bf;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  white-space: nowrap;
}

.status-in-shelter {
  background: #dbf4ff;
  color: #0369a1;
}

.status-pending {
  background: #fef9c3;
  color: #854d0e;
}

.status-adopted {
  background: #dcfce7;
  color: #166534;
}

.status-unavailable {
  background: #fee2e2;
  color: #991b1b;
}

.status-default {
  background: #e5e7eb;
  color: #374151;
}

@media (max-width: 600px) {
  input,
  select {
    min-width: unset;
    width: 100%;
  }

  .reset {
    width: 100%;
    margin-left: 0;
  }
}
</style>
