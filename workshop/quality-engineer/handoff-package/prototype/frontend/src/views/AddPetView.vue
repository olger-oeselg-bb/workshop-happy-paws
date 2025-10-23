<template>
  <div class="add-view">
    <header class="header">
      <div>
        <h2>Add a new pet</h2>
        <p>Capture the basics now—we will expand the intake workflow in later phases.</p>
      </div>
      <router-link class="link" :to="{ name: 'home' }">Back to list</router-link>
    </header>

    <form class="form" @submit.prevent="handleSubmit">
      <fieldset :disabled="saving">
        <legend class="sr-only">Pet details</legend>

        <label class="field">
          <span class="field-label">Name <sup aria-hidden="true">*</sup></span>
          <input v-model.trim="form.name" type="text" name="name" autocomplete="off" required />
        </label>

        <label class="field">
          <span class="field-label">Type <sup aria-hidden="true">*</sup></span>
          <select v-model="form.type" name="type" required>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label class="field">
          <span class="field-label">Breed</span>
          <input v-model.trim="form.breed" type="text" name="breed" autocomplete="off" />
        </label>

        <label class="field">
          <span class="field-label">Age</span>
          <input v-model.trim="form.age" type="number" min="0" max="30" name="age" />
        </label>

        <label class="field">
          <span class="field-label">Gender</span>
          <select v-model="form.gender" name="gender">
            <option value="Unknown">Unknown</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>

        <label class="field">
          <span class="field-label">Status</span>
          <select v-model="form.status" name="status">
            <option value="In Shelter">In Shelter</option>
            <option value="Pending Adoption">Pending Adoption</option>
            <option value="Adopted">Adopted</option>
            <option value="Not Available">Not Available</option>
          </select>
        </label>

        <label class="field">
          <span class="field-label">Photo URL</span>
          <input v-model.trim="form.photoUrl" type="url" name="photoUrl" placeholder="https://…" />
        </label>
      </fieldset>

      <div v-if="errors.length" class="form-errors" role="alert">
        <p>Please address the following:</p>
        <ul>
          <li v-for="(entry, index) in errors" :key="index">{{ entry }}</li>
        </ul>
      </div>

      <div class="actions">
        <button class="primary" type="submit">
          {{ saving ? 'Saving…' : 'Save pet' }}
        </button>
        <button class="secondary" type="button" @click="resetForm" :disabled="saving">
          Clear
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePetsStore, useUIStore } from '@/stores';

const router = useRouter();
const petsStore = usePetsStore();
const uiStore = useUIStore();

const saving = ref(false);
const errors = ref([]);

const defaultForm = {
  name: '',
  type: 'Dog',
  breed: '',
  age: '',
  gender: 'Unknown',
  status: 'In Shelter',
  photoUrl: ''
};

const form = reactive({ ...defaultForm });

function validate() {
  const issues = [];
  if (!form.name) {
    issues.push('Name is required.');
  }
  if (!form.type) {
    issues.push('Type is required.');
  }
  if (form.photoUrl && !/^https?:\/\//i.test(form.photoUrl)) {
    issues.push('Photo URL must start with http:// or https://.');
  }
  if (form.age && Number(form.age) < 0) {
    issues.push('Age must be positive.');
  }
  return issues;
}

function resetForm() {
  Object.assign(form, defaultForm);
  errors.value = [];
}

async function handleSubmit() {
  errors.value = validate();
  if (errors.value.length) {
    return;
  }

  saving.value = true;
  try {
    const payload = {
      name: form.name,
      type: form.type,
      breed: form.breed,
      age: form.age,
      gender: form.gender,
      status: form.status,
      photoUrl: form.photoUrl
    };

    const newPet = await petsStore.createPet(payload);
    uiStore.showSuccess(`${newPet.name} was added to the registry.`);
    resetForm();
    await router.push({ name: 'pet-profile', params: { id: newPet.id } });
  } catch (err) {
    const message = err?.message || 'Unable to save pet.';
    uiStore.showError(message);
    errors.value = [message];
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

.form {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.08);
}

fieldset {
  display: grid;
  gap: 1rem;
  border: none;
  padding: 0;
  margin: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a5568;
}

input,
select {
  padding: 0.65rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
}

.form-errors {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: #fef2f2;
  color: #b91c1c;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.primary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: #667eea;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

.secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #cbd5f5;
  background: #fff;
  font-weight: 600;
  color: #4c51bf;
  cursor: pointer;
}

.primary:disabled,
.secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
