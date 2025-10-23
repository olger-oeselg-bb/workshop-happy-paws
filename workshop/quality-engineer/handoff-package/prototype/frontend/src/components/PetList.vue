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
      <PetCard
        v-for="pet in filteredPets"
        :key="pet.id"
        :pet="pet"
        @select="handleSelect"
      />
    </ul>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { usePetsStore, useUIStore } from '@/stores';
import PetCard from '@/components/PetCard.vue';

const petsStore = usePetsStore();
const uiStore = useUIStore();

const { filteredPets, petCount, filteredCount, loading, error } = storeToRefs(petsStore);

async function refresh() {
  try {
    await petsStore.fetchPets();
    uiStore.showSuccess('Pet list refreshed');
  } catch (err) {
    uiStore.showError(err.message || 'Unable to refresh pets');
  }
}

function handleSelect(pet) {
  // PetCard emits select event, but since we have router-link inside,
  // the navigation is handled by the link. This could be used for other actions if needed.
  console.log('Pet selected:', pet.name);
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
</style>