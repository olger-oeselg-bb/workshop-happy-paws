<template>
  <div class="pet-gallery">
    <figure class="main-photo">
      <img
        :src="pet.photoUrl || placeholderImage"
        :alt="pet.name"
        @click="openLightbox(pet.photoUrl || placeholderImage)"
      />
    </figure>

    <div class="additional-photos" v-if="galleryPhotos.length > 0">
      <img
        v-for="(photo, index) in galleryPhotos"
        :key="index"
        :src="photo"
        :alt="`${pet.name} photo ${index + 1}`"
        @click="openLightbox(photo)"
        class="thumbnail"
      />
    </div>

    <div class="upload-section">
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        @change="handleFileChange"
        style="display: none"
      />
      <button
        type="button"
        @click="triggerFileInput"
        class="upload-btn"
        aria-label="Upload additional photos for this pet"
      >
        Upload photos
      </button>
      <p class="upload-note">(or drag & drop not supported in prototype)</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  pet: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['lightbox-open', 'photos-upload']);

const fileInput = ref(null);
const placeholderImage = '/images/placeholder.svg';

// For now, we'll simulate additional photos - in a real implementation,
// this would come from the pet data or a separate API call
const galleryPhotos = computed(() => {
  // This is a placeholder - additional photos would be stored separately
  return [];
});

function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

function handleFileChange(event) {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    emit('photos-upload', { petId: props.pet.id, files });
  }
  // Clear the input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function openLightbox(src) {
  emit('lightbox-open', src);
}
</script>

<style scoped>
.pet-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-photo {
  margin: 0;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;
  aspect-ratio: 4 / 3;
  max-width: 300px;
}

.main-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.main-photo img:hover {
  transform: scale(1.02);
}

.additional-photos {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.thumbnail:hover {
  transform: scale(1.05);
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.upload-btn {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.upload-btn:hover {
  background: #f9fafb;
}

.upload-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.upload-note {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}
</style>