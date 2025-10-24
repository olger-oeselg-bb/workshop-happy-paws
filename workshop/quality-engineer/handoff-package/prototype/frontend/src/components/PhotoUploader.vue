<template>
  <div class="photo-uploader">
    <div
      class="upload-zone"
      :class="{ 'is-drag-over': isDragOver, 'is-disabled': disabled }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      role="button"
      tabindex="0"
      :aria-label="uploadLabel"
      @keydown.enter="triggerFileInput"
      @keydown.space.prevent="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :multiple="multiple"
        :accept="accept"
        @change="handleFileChange"
        style="display: none"
      />

      <div class="upload-content">
        <div class="upload-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </div>

        <div class="upload-text">
          <p class="primary-text">{{ primaryText }}</p>
          <p class="secondary-text">{{ secondaryText }}</p>
        </div>

        <button
          v-if="showButton"
          type="button"
          class="upload-button"
          :disabled="disabled"
          @click.stop="triggerFileInput"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>

    <!-- File Preview -->
    <div v-if="files.length > 0" class="file-preview">
      <h4 class="preview-title">Selected files:</h4>
      <ul class="file-list">
        <li
          v-for="(file, index) in files"
          :key="index"
          class="file-item"
        >
          <div class="file-info">
            <div class="file-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM4 7v10h16V7H4zm8 2l3 4H9l-2 3-1-1.5L8 11l4-2z"/>
              </svg>
            </div>
            <div class="file-details">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
            </div>
          </div>
          <button
            type="button"
            class="remove-file"
            @click="removeFile(index)"
            :aria-label="`Remove ${file.name}`"
          >
            ×
          </button>
        </li>
      </ul>

      <div class="preview-actions">
        <button
          type="button"
          class="clear-all"
          @click="clearFiles"
          :disabled="uploading"
        >
          Clear all
        </button>
        <button
          type="button"
          class="upload-files"
          @click="uploadFiles"
          :disabled="uploading || files.length === 0"
        >
          {{ uploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  multiple: {
    type: Boolean,
    default: true
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  maxSize: {
    type: Number,
    default: 10 * 1024 * 1024 // 10MB
  },
  disabled: {
    type: Boolean,
    default: false
  },
  uploading: {
    type: Boolean,
    default: false
  },
  showButton: {
    type: Boolean,
    default: true
  },
  primaryText: {
    type: String,
    default: 'Drop photos here or click to browse'
  },
  secondaryText: {
    type: String,
    default: 'Supports JPG, PNG, GIF up to 10MB each'
  },
  buttonText: {
    type: String,
    default: 'Choose Files'
  }
});

const emit = defineEmits(['files-selected', 'upload-requested']);

const fileInput = ref(null);
const isDragOver = ref(false);
const files = ref([]);

const uploadLabel = computed(() => {
  if (props.disabled) return 'File upload is disabled';
  return props.multiple
    ? 'Click or drag files here to upload'
    : 'Click or drag a file here to upload';
});

function triggerFileInput() {
  if (props.disabled || props.uploading) return;
  if (fileInput.value) {
    fileInput.value.click();
  }
}

function handleDragOver() {
  if (props.disabled || props.uploading) return;
  isDragOver.value = true;
}

function handleDragLeave() {
  isDragOver.value = false;
}

function handleDrop(event) {
  if (props.disabled || props.uploading) return;
  isDragOver.value = false;

  const droppedFiles = Array.from(event.dataTransfer.files);
  processFiles(droppedFiles);
}

function handleFileChange(event) {
  const selectedFiles = Array.from(event.target.files);
  processFiles(selectedFiles);

  // Clear the input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function processFiles(newFiles) {
  // Filter for accepted file types
  const acceptedFiles = newFiles.filter(file => {
    if (props.accept === 'image/*') {
      return file.type.startsWith('image/');
    }
    // For more complex accept patterns, you might need additional logic
    return true;
  });

  // Filter by size
  const validFiles = acceptedFiles.filter(file => file.size <= props.maxSize);

  // Handle multiple vs single file selection
  if (!props.multiple) {
    files.value = validFiles.slice(0, 1);
  } else {
    files.value = [...files.value, ...validFiles];
  }

  emit('files-selected', files.value);
}

function removeFile(index) {
  files.value.splice(index, 1);
  emit('files-selected', files.value);
}

function clearFiles() {
  files.value = [];
  emit('files-selected', files.value);
}

function uploadFiles() {
  if (files.value.length === 0 || props.uploading) return;
  emit('upload-requested', files.value);
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Expose methods for parent components
defineExpose({
  clearFiles,
  getFiles: () => files.value
});
</script>

<style scoped>
.photo-uploader {
  width: 100%;
  max-width: 400px;
}

.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafafa;
}

.upload-zone:hover:not(.is-disabled) {
  border-color: #9ca3af;
  background: #f9fafb;
}

.upload-zone.is-drag-over {
  border-color: #3b82f6;
  background: #eff6ff;
}

.upload-zone.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f3f4f6;
}

.upload-zone:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #9ca3af;
}

.upload-icon svg {
  width: 100%;
  height: 100%;
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.primary-text {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
}

.secondary-text {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.upload-button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.upload-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* File Preview Styles */
.file-preview {
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.preview-title {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.file-icon {
  width: 32px;
  height: 32px;
  color: #9ca3af;
  flex-shrink: 0;
}

.file-icon svg {
  width: 100%;
  height: 100%;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 0.75rem;
  color: #6b7280;
}

.remove-file {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.remove-file:hover {
  background: #fef2f2;
}

.preview-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.clear-all,
.upload-files {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #d1d5db;
}

.clear-all {
  background: white;
  color: #374151;
}

.clear-all:hover:not(:disabled) {
  background: #f9fafb;
}

.upload-files {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.upload-files:hover:not(:disabled) {
  background: #2563eb;
}

.clear-all:disabled,
.upload-files:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .upload-zone {
    padding: 1.5rem;
  }

  .upload-content {
    gap: 0.75rem;
  }

  .upload-icon {
    width: 40px;
    height: 40px;
  }

  .primary-text {
    font-size: 0.875rem;
  }

  .secondary-text {
    font-size: 0.75rem;
  }

  .file-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .preview-actions {
    flex-direction: column;
  }
}
</style>