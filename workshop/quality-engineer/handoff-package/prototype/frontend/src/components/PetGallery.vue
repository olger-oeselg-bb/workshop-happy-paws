<template>
  <div class="pet-gallery">
    <PhotoGallery
      :photos="allPhotos"
      :pet-name="pet.name"
      @photo-view="handlePhotoView"
    />

    <PhotoUploader
      :multiple="true"
      :accept="'image/*'"
      :max-size="10 * 1024 * 1024"
      :primary-text="'Drop photos here or click to browse'"
      :secondary-text="'Supports JPG, PNG, GIF up to 10MB each'"
      :button-text="'Choose Photos'"
      @files-selected="handleFilesSelected"
      @upload-requested="handleUploadRequested"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import PhotoGallery from './PhotoGallery.vue';
import PhotoUploader from './PhotoUploader.vue';

const props = defineProps({
  pet: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['lightbox-open', 'photos-upload']);

// Combine main photo with additional photos
const allPhotos = computed(() => {
  const photos = [];

  // Add main photo if it exists
  if (props.pet.photoUrl) {
    photos.push({
      src: props.pet.photoUrl,
      alt: `${props.pet.name} main photo`,
      isMain: true
    });
  }

  // Add additional photos (placeholder for now - would come from pet data)
  // In a real implementation, additional photos would be stored in pet.galleryPhotos or similar
  const additionalPhotos = []; // props.pet.galleryPhotos || [];
  additionalPhotos.forEach((photo, index) => {
    photos.push({
      src: photo,
      alt: `${props.pet.name} photo ${index + 1}`,
      isMain: false
    });
  });

  return photos;
});

function handlePhotoView(photo) {
  emit('lightbox-open', photo.src);
}

function handleFilesSelected(files) {
  // Files are selected but not yet uploaded
  // Could emit an event or handle preview here if needed
}

function handleUploadRequested(files) {
  emit('photos-upload', { petId: props.pet.id, files });
}
</script>

<style scoped>
.pet-gallery {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>