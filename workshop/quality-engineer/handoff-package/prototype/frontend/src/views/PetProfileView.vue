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
      <div class="profile">
        <figure class="photo">
          <img :src="pet.photoUrl || placeholderImage" :alt="pet.name" />
        </figure>
        <div class="details">
          <dl>
            <div class="row">
              <dt>Status</dt>
              <dd>
                <select v-model="localStatus" @change="handleStatusChange">
                  <option v-for="option in statusOptions" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </dd>
            </div>
            <div class="row">
              <dt>Type</dt>
              <dd>{{ pet.type }}</dd>
            </div>
            <div class="row">
              <dt>Breed</dt>
              <dd>{{ pet.breed || 'Unknown' }}</dd>
            </div>
            <div class="row">
              <dt>Age</dt>
              <dd>{{ pet.age || 'Unlisted' }}</dd>
            </div>
            <div class="row">
              <dt>Gender</dt>
              <dd>{{ pet.gender || 'Unknown' }}</dd>
            </div>
          </dl>
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

const router = useRouter();
const route = useRoute();
const petsStore = usePetsStore();
const uiStore = useUIStore();

const { activePet, loading } = storeToRefs(petsStore);
const placeholderImage = '/images/placeholder.svg';

const statusOptions = ['In Shelter', 'Pending Adoption', 'Adopted', 'Not Available'];
const localStatus = ref(statusOptions[0]);

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
  localStatus.value = next.status || statusOptions[0];
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

async function handleStatusChange() {
  if (!pet.value) return;
  const newStatus = localStatus.value;
  if (newStatus === pet.value.status) return;

  try {
    await petsStore.updatePet(pet.value.id, { status: newStatus });
    uiStore.showSuccess(`${pet.value.name}'s status updated to ${newStatus}.`);
  } catch (err) {
    localStatus.value = pet.value.status;
    uiStore.showError(err?.message || 'Unable to update status.');
  }
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

.profile {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.photo {
  flex: 0 0 260px;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  overflow: hidden;
  margin: 0;
  background: #e5e7eb;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details {
  flex: 1;
}

dl {
  display: grid;
  gap: 1rem;
  margin: 0;
}

.row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 0.75rem;
  align-items: center;
}

dt {
  font-weight: 600;
  color: #4b5563;
}

dd {
  margin: 0;
  color: #1f2937;
}

select {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
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
  .row {
    grid-template-columns: 1fr;
  }

  .photo {
    flex: 1 1 100%;
  }
}
</style>
