<template>
  <form class="form" @submit.prevent="handleSubmit">
    <fieldset :disabled="saving">
      <legend class="sr-only">Pet details</legend>

      <label class="field">
        <span class="field-label">Name <sup aria-hidden="true">*</sup></span>
        <input v-model.trim="form.name" type="text" name="name" autocomplete="off" required aria-describedby="name-error" />
      </label>

      <label class="field">
        <span class="field-label">Type <sup aria-hidden="true">*</sup></span>
        <select v-model="form.type" name="type" required aria-describedby="type-error">
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

    <div v-if="errors.length" class="form-errors" role="alert" aria-live="polite">
      <p>Please address the following:</p>
      <ul>
        <li v-for="(entry, index) in errors" :key="index" :id="`error-${index}`">{{ entry }}</li>
      </ul>
    </div>

    <div class="actions">
      <button class="primary" type="submit" :disabled="saving">
        {{ saving ? 'Saving…' : 'Save pet' }}
      </button>
      <button class="secondary" type="button" @click="resetForm" :disabled="saving">
        Clear
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
  saving: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit']);

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

function handleSubmit() {
  errors.value = validate();
  if (errors.value.length) {
    return;
  }

  const payload = {
    name: form.name,
    type: form.type,
    breed: form.breed,
    age: form.age,
    gender: form.gender,
    status: form.status,
    photoUrl: form.photoUrl
  };

  emit('submit', payload);
}
</script>

<style scoped>
.form {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.08);
}

fieldset {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
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

.field input:invalid,
.field select:invalid {
  border-color: #dc3545;
}

.form-errors {
  background-color: #fed7d7;
  color: #c53030;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #dc3545;
}

.form-errors ul {
  margin: 0.5rem 0 0;
  padding-left: 1.5rem;
}

.form-errors li {
  margin: 0.25rem 0;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  background-color: #667eea;
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.primary:hover:not(:disabled) {
  background-color: #5a67d8;
}

.primary:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background-color: #fff;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.secondary:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.secondary:disabled {
  color: #a0aec0;
  cursor: not-allowed;
}
</style>