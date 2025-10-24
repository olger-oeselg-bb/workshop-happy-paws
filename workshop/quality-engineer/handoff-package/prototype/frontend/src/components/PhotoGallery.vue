<template>
  <div class="photo-gallery" role="region" aria-label="Photo gallery">
    <div v-if="photos.length === 0" class="empty-gallery">
      <div class="placeholder-image">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM4 7v10h16V7H4zm8 2l3 4H9l-2 3-1-1.5L8 11l4-2z"/>
        </svg>
      </div>
      <p class="empty-text">No photos available</p>
    </div>

    <div v-else class="photos-grid" role="list">
      <div
        v-for="(photo, index) in photos"
        :key="photo.id || index"
        class="photo-item"
        role="listitem"
        tabindex="0"
        :aria-label="`Photo ${index + 1} of ${photos.length}`"
        @click="selectPhoto(photo, index)"
        @keydown.enter="selectPhoto(photo, index)"
        @keydown.space.prevent="selectPhoto(photo, index)"
      >
        <img
          :src="photo.url"
          :alt="photo.alt || `Photo ${index + 1}`"
          class="photo-thumbnail"
          :class="{ 'is-primary': photo.isPrimary }"
        />
        <div v-if="photo.isPrimary" class="primary-badge" aria-label="Primary photo">
          Primary
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="lightboxOpen"
          class="lightbox-overlay"
          @click="closeLightbox"
          @keydown.escape="closeLightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
          tabindex="-1"
        >
          <div class="lightbox-content" @click.stop>
            <button
              class="lightbox-close"
              @click="closeLightbox"
              aria-label="Close lightbox"
            >
              ×
            </button>

            <button
              v-if="currentIndex > 0"
              class="lightbox-nav lightbox-prev"
              @click="navigatePhoto(-1)"
              aria-label="Previous photo"
            >
              ‹
            </button>

            <div class="lightbox-image-container">
              <img
                :src="currentPhoto?.url"
                :alt="currentPhoto?.alt || `Photo ${currentIndex + 1}`"
                class="lightbox-image"
              />
              <div class="lightbox-caption">
                {{ currentIndex + 1 }} of {{ photos.length }}
                <span v-if="currentPhoto?.isPrimary" class="caption-primary">
                  (Primary)
                </span>
              </div>
            </div>

            <button
              v-if="currentIndex < photos.length - 1"
              class="lightbox-nav lightbox-next"
              @click="navigatePhoto(1)"
              aria-label="Next photo"
            >
              ›
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';

const props = defineProps({
  photos: {
    type: Array,
    default: () => []
  },
  primaryPhotoId: {
    type: [String, Number],
    default: null
  }
});

const emit = defineEmits(['photo-select', 'photo-view']);

const lightboxOpen = ref(false);
const currentIndex = ref(0);
const currentPhoto = ref(null);

// Mark primary photo
const processedPhotos = computed(() => {
  return props.photos.map((photo, index) => ({
    ...photo,
    isPrimary: photo.id === props.primaryPhotoId || (index === 0 && !props.primaryPhotoId)
  }));
});

function selectPhoto(photo, index) {
  currentPhoto.value = photo;
  currentIndex.value = index;
  lightboxOpen.value = true;
  emit('photo-view', { photo, index });
}

function closeLightbox() {
  lightboxOpen.value = false;
  currentPhoto.value = null;
}

function navigatePhoto(direction) {
  const newIndex = currentIndex.value + direction;
  if (newIndex >= 0 && newIndex < props.photos.length) {
    currentIndex.value = newIndex;
    currentPhoto.value = props.photos[newIndex];
  }
}

// Keyboard navigation for lightbox
function handleKeydown(event) {
  if (!lightboxOpen.value) return;

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      navigatePhoto(-1);
      break;
    case 'ArrowRight':
      event.preventDefault();
      navigatePhoto(1);
      break;
    case 'Escape':
      event.preventDefault();
      closeLightbox();
      break;
  }
}

// Add/remove keyboard listeners
watch(lightboxOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
});

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.photo-gallery {
  width: 100%;
}

.empty-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
}

.placeholder-image {
  width: 48px;
  height: 48px;
  color: #9ca3af;
}

.placeholder-image svg {
  width: 100%;
  height: 100%;
}

.empty-text {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 2px solid transparent;
}

.photo-item:hover,
.photo-item:focus {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  outline: none;
}

.photo-item:focus {
  border-color: #3b82f6;
}

.photo-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.2s ease;
}

.photo-thumbnail.is-primary {
  filter: brightness(1.1);
}

.primary-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: zoom-out;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lightbox-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: background-color 0.2s ease;
}

.lightbox-close:hover {
  background: rgba(0, 0, 0, 0.9);
}

.lightbox-nav {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.lightbox-nav:hover {
  background: rgba(0, 0, 0, 0.9);
}

.lightbox-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lightbox-image-container {
  position: relative;
  max-width: 80vw;
  max-height: 80vh;
}

.lightbox-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.lightbox-caption {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  white-space: nowrap;
}

.caption-primary {
  color: #3b82f6;
  font-weight: 600;
}

/* Lightbox Transitions */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
  }

  .lightbox-content {
    flex-direction: column;
    gap: 0.5rem;
  }

  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .lightbox-prev {
    left: 10px;
  }

  .lightbox-next {
    right: 10px;
  }

  .lightbox-close {
    top: 10px;
    right: 10px;
  }

  .lightbox-caption {
    bottom: -40px;
    font-size: 0.75rem;
  }
}
</style>