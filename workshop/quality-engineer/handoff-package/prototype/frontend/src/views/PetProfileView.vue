<template>
  <div class="profile-view" aria-live="polite">
    <header class="header">
      <button class="link" type="button" @click="goBack">← Back to list</button>
      <h2 v-if="pet">{{ pet.name }}</h2>
      <p v-if="pet" class="subhead">Added {{ createdAt }}</p>
    </header>

    <section v-if="loading" class="state">Loading pet profile…</section>

    <section v-else-if="!pet" class="state state-error">
      Pet details are unavailable. Try returning to the list and selecting the pet again.
    </section>

    <section v-else class="card">
      <div class="profile-content">
        <PetGallery
          :pet="pet"
          @lightbox-open="openLightbox"
          @photos-upload="handlePhotoUpload"
        />

        <div class="details-section">
          <PetStatus
            v-model="localStatus"
            :pet-id="pet.id"
            @status-changed="handleStatusChange"
          />

          <PetDetails :pet="pet" />
        </div>
      </div>

      <footer class="card-footer">
        <router-link class="link" :to="{ name: 'add-pet' }">Add another pet</router-link>
      </footer>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePetsStore, useUIStore } from '@/stores';
import PetGallery from '@/components/PetGallery.vue';
import PetStatus from '@/components/PetStatus.vue';
import PetDetails from '@/components/PetDetails.vue';

const router = useRouter();
const route = useRoute();
const petsStore = usePetsStore();
const uiStore = useUIStore();

const { activePet, loading } = storeToRefs(petsStore);

const localStatus = ref('In Shelter');

const pet = computed(() => activePet.value);
const createdAt = computed(() => {
  if (!pet.value?.createdAt) return 'recently';
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(pet.value.createdAt));
  } catch (err) {
    return 'recently';
  }
});

watch(pet, async (next) => {
  if (!next) return;
  localStatus.value = next.status || 'In Shelter';
});

watch(
  () => route.params.id,
  async (id) => {
    if (!id) return;
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) {
      uiStore.showError('Invalid pet id.');
      router.replace({ name: 'home' });
      return;
    }

    try {
      if (!pet.value || pet.value.id !== numericId) {
        await petsStore.fetchPetById(numericId);
      }
    } catch (err) {
      uiStore.showError(err?.message || 'Unable to load pet');
      router.replace({ name: 'home' });
    }
  },
  { immediate: true }
);

function goBack() {
  router.push({ name: 'home' });
}

async function handleStatusChange({ petId, status }) {
  try {
    await petsStore.updatePet(petId, { status });
    uiStore.showSuccess(`${pet.value.name}'s status updated to ${status}.`);
  } catch (err) {
    localStatus.value = pet.value.status;
    uiStore.showError(err?.message || 'Unable to update status.');
  }
}

function openLightbox(src) {
  // For now, just log - lightbox functionality would be implemented later
  console.log('Open lightbox for:', src);
}

function handlePhotoUpload({ petId, files }) {
  // For now, just log - photo upload functionality would be implemented later
  console.log('Upload photos for pet', petId, files);
}
</script>

<style scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-block: 1rem;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.header h2 {
  margin: 0;
  color: #1f2937;
}

.subhead {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.link {
  align-self: flex-start;
  color: #4c51bf;
  font-weight: 600;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-decoration: none;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.08);
}

.profile-content {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
}

.details-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  min-width: 280px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.state {
  padding: 1.5rem;
  border-radius: 12px;
  background: #f9fafb;
  color: #4b5563;
}

.state-error {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #991b1b;
}

@media (max-width: 720px) {
  .profile-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .details-section {
    min-width: auto;
  }
}
</style>
