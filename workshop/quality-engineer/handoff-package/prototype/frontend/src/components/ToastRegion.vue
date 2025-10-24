<template>
  <div class="toast-container" role="status" aria-live="polite">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in activeToasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
      >
        <p class="toast-message">{{ toast.message }}</p>
        <button
          v-if="toast.dismissible"
          class="toast-close"
          type="button"
          @click="dismissToast(toast.id)"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useUIStore } from '@/stores';

const uiStore = useUIStore();
const { activeToasts } = storeToRefs(uiStore);
const { dismissToast } = uiStore;
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 20;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  min-width: 280px;
  max-width: 360px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.25);
  border-left: 5px solid #4c51bf;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

.toast-message {
  flex: 1;
  margin: 0;
  color: #1f2937;
}

.toast-success {
  border-left-color: #16a34a;
}

.toast-error {
  border-left-color: #dc2626;
}

.toast-warning {
  border-left-color: #d97706;
}

.toast-info {
  border-left-color: #2563eb;
}

.toast-close {
  border: none;
  background: none;
  color: #6b7280;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}

.toast-close:hover {
  color: #111827;
}
</style>
