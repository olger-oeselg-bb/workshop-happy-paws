<template>
  <div class="pet-status">
    <label for="status-select" class="status-label">Status</label>
    <select
      id="status-select"
      v-model="localStatus"
      @change="handleStatusChange"
      class="status-select"
      :class="statusClass"
      aria-label="Change pet status"
    >
      <option v-for="option in statusOptions" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  petId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'status-changed']);

const statusOptions = ['In Shelter', 'Pending Adoption', 'Adopted', 'Not Available'];
const localStatus = ref(props.modelValue);

const statusClass = computed(() => {
  const status = localStatus.value;
  if (status === 'In Shelter') return 'status-in-shelter';
  if (status === 'Pending Adoption') return 'status-pending';
  if (status === 'Adopted') return 'status-adopted';
  if (status === 'Not Available') return 'status-not-available';
  return '';
});

watch(() => props.modelValue, (newValue) => {
  localStatus.value = newValue;
});

function handleStatusChange() {
  const newStatus = localStatus.value;
  if (newStatus === props.modelValue) return;

  emit('update:modelValue', newStatus);
  emit('status-changed', { petId: props.petId, status: newStatus });
}
</script>

<style scoped>
.pet-status {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.status-select {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 0.875rem;
  background: white;
  min-width: 140px;
}

.status-select:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.status-in-shelter {
  border-color: #10b981;
  background-color: #f0fdf4;
}

.status-pending {
  border-color: #f59e0b;
  background-color: #fffbeb;
}

.status-adopted {
  border-color: #8b5cf6;
  background-color: #faf5ff;
}

.status-not-available {
  border-color: #ef4444;
  background-color: #fef2f2;
}
</style>