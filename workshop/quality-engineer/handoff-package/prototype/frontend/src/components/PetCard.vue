<template>
  <li class="pet-card" @click="handleSelect" @keydown.enter="handleSelect" @keydown.space.prevent="handleSelect" tabindex="0" role="button" :aria-label="`View profile for ${pet.name}, ${pet.type}, status: ${pet.status}`">
    <figure class="pet-photo">
      <img :src="pet.photoUrl || placeholderImage" :alt="`Photo of ${pet.name}, a ${pet.type}`" loading="lazy" />
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
        @click.stop
        aria-label="View full profile"
      >
        View profile
      </router-link>
    </div>
  </li>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
  pet: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['select']);

const placeholderImage = '/images/placeholder.svg';

function handleSelect() {
  emit('select', props.pet);
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
.pet-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.pet-card:hover,
.pet-card:focus {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  outline: 2px solid #667eea;
  outline-offset: 2px;
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