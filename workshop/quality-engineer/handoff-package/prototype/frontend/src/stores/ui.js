import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * UI Store
 * Manages UI state: toast messages, modals, global loading states
 */
export const useUIStore = defineStore('ui', () => {
  // State
  const toasts = ref([]);
  const modals = ref([]);
  const globalLoading = ref(false);
  const toastIdCounter = ref(1);
  const modalIdCounter = ref(1);

  // Getters
  const hasActiveModal = computed(() => modals.value.length > 0);
  const activeToasts = computed(() => toasts.value.filter(t => !t.dismissed));
  const toastCount = computed(() => activeToasts.value.length);

  // Actions

  /**
   * Show a toast notification
   * @param {Object} options - Toast options
   * @param {string} options.message - The message to display
   * @param {string} [options.type='info'] - Toast type: 'success', 'error', 'warning', 'info'
   * @param {number} [options.duration=5000] - Duration in ms (0 for persistent)
   * @param {boolean} [options.dismissible=true] - Whether the toast can be manually dismissed
   */
  function showToast({ message, type = 'info', duration = 5000, dismissible = true }) {
    const id = toastIdCounter.value++;
    const toast = {
      id,
      message,
      type,
      duration,
      dismissible,
      dismissed: false,
      createdAt: Date.now()
    };

    toasts.value.push(toast);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }

  function showSuccess(message, duration = 3000) {
    return showToast({ message, type: 'success', duration });
  }

  function showError(message, duration = 5000) {
    return showToast({ message, type: 'error', duration });
  }

  function showWarning(message, duration = 4000) {
    return showToast({ message, type: 'warning', duration });
  }

  function showInfo(message, duration = 3000) {
    return showToast({ message, type: 'info', duration });
  }

  function dismissToast(id) {
    const toast = toasts.value.find(t => t.id === id);
    if (toast) {
      toast.dismissed = true;
      // Remove from array after animation time
      setTimeout(() => {
        const index = toasts.value.findIndex(t => t.id === id);
        if (index !== -1) {
          toasts.value.splice(index, 1);
        }
      }, 300);
    }
  }

  function clearAllToasts() {
    toasts.value.forEach(toast => {
      toast.dismissed = true;
    });
    setTimeout(() => {
      toasts.value = [];
    }, 300);
  }

  /**
   * Open a modal
   * @param {Object} options - Modal options
   * @param {string} options.component - The component name to render
   * @param {Object} [options.props={}] - Props to pass to the modal component
   * @param {Function} [options.onClose] - Callback when modal is closed
   * @param {boolean} [options.dismissible=true] - Whether modal can be dismissed by clicking outside
   */
  function openModal({ component, props = {}, onClose, dismissible = true }) {
    const id = modalIdCounter.value++;
    const modal = {
      id,
      component,
      props,
      onClose,
      dismissible,
      createdAt: Date.now()
    };

    modals.value.push(modal);
    return id;
  }

  function closeModal(id) {
    const index = modals.value.findIndex(m => m.id === id);
    if (index !== -1) {
      const modal = modals.value[index];
      if (modal.onClose) {
        modal.onClose();
      }
      modals.value.splice(index, 1);
    }
  }

  function closeAllModals() {
    modals.value.forEach(modal => {
      if (modal.onClose) {
        modal.onClose();
      }
    });
    modals.value = [];
  }

  function setGlobalLoading(isLoading) {
    globalLoading.value = isLoading;
  }

  /**
   * Show a confirmation dialog (convenience wrapper for modal)
   * @param {Object} options
   * @param {string} options.title - Dialog title
   * @param {string} options.message - Dialog message
   * @param {string} [options.confirmText='Confirm'] - Confirm button text
   * @param {string} [options.cancelText='Cancel'] - Cancel button text
   * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
   */
  function confirm({ title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) {
    return new Promise((resolve) => {
      openModal({
        component: 'ConfirmDialog',
        props: { title, message, confirmText, cancelText },
        onClose: () => resolve(false),
        dismissible: true
      });

      // Note: The actual ConfirmDialog component would need to call closeModal
      // and resolve the promise when user clicks confirm
      // This is a placeholder pattern
    });
  }

  return {
    // State
    toasts,
    modals,
    globalLoading,
    // Getters
    hasActiveModal,
    activeToasts,
    toastCount,
    // Actions
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissToast,
    clearAllToasts,
    openModal,
    closeModal,
    closeAllModals,
    setGlobalLoading,
    confirm
  };
});
