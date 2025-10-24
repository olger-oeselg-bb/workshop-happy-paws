<template>
  <div class="add-view">
    <header class="header">
      <div>
        <h2>Add a new pet</h2>
        <p>Capture the basics now—we will expand the intake workflow in later phases.</p>
      </div>
      <router-link class="link" :to="{ name: 'home' }">Back to list</router-link>
    </header>

    <AddPetForm @submit="handleSubmit" :saving="saving" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePetsStore, useUIStore } from '@/stores';
import AddPetForm from '@/components/AddPetForm.vue';

const router = useRouter();
const petsStore = usePetsStore();
const uiStore = useUIStore();

const saving = ref(false);

async function handleSubmit(payload) {
  saving.value = true;
  try {
    const newPet = await petsStore.createPet(payload);
    uiStore.showSuccess(`${newPet.name} was added to the registry.`);
    await router.push({ name: 'pet-profile', params: { id: newPet.id } });
  } catch (err) {
    const message = err?.message || 'Unable to save pet.';
    uiStore.showError(message);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.add-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-block: 1rem;
}

.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.header h2 {
  margin: 0 0 0.25rem;
  color: #1f2937;
}

.header p {
  margin: 0;
  color: #4b5563;
}

.link {
  color: #4c51bf;
  font-weight: 600;
  text-decoration: none;
}
</style>
