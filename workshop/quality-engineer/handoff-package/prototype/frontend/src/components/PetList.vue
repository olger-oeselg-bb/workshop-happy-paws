<template>
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
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { usePetsStore, useUIStore } from '@/stores';

const petsStore = usePetsStore();
const uiStore = useUIStore();

const { filteredPets, petCount, filteredCount, loading, error } = storeToRefs(petsStore);

const placeholderImage = '/images/placeholder.svg';

async function refresh() {
  try {
    await petsStore.fetchPets();
    uiStore.showSuccess('Pet list refreshed');
  } catch (err) {
    uiStore.showError(err.message || 'Unable to refresh pets');
  }
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
.inventory {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.inventory-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.inventory-title {
  margin: 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.inventory-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #718096;
}

.link {
  padding: 0.25rem 0.5rem;
  border: none;
  background: none;
  color: #667eea;
  font-size: 0.875rem;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s ease;
}

.link:hover:not(:disabled) {
  color: #5a67d8;
}

.link:disabled {
  color: #a0aec0;
  cursor: not-allowed;
}

.state {
  padding: 1rem;
  text-align: center;
  color: #4a5568;
  font-style: italic;
}

.state-error {
  background-color: #fed7d7;
  color: #c53030;
  border-radius: 4px;
}

.pet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.pet-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.pet-photo {
  margin: 0;
  aspect-ratio: 4 / 3;
  overflow: hidden;
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
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.pet-header h4 {
  margin: 0;
  font-size: 1.125rem;
  color: #2c3e50;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-in-shelter {
  background-color: #c6f6d5;
  color: #22543d;
}

.status-pending {
  background-color: #fef5e7;
  color: #744210;
}

.status-adopted {
  background-color: #bee3f8;
  color: #2a4365;
}

.status-unavailable {
  background-color: #fed7d7;
  color: #742a2a;
}

.status-default {
  background-color: #e2e8f0;
  color: #4a5568;
}

.pet-meta {
  margin: 0;
  font-size: 0.875rem;
  color: #718096;
}

.pet-link {
  margin-top: auto;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #667eea;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  text-align: center;
  transition: background-color 0.2s ease;
}

.pet-link:hover {
  background-color: #5a67d8;
}

.pet-link:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
</style>