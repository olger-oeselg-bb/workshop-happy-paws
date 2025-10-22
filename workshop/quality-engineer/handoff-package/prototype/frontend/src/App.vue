<template>
  <div class="app-container">
    <header class="app-header">
      <h1>🐾 Happy Paws</h1>
      <p class="subtitle">Pet Registry System - Vue 3 + Pinia Migration</p>
    </header>
    
    <main class="main-content">
      <div class="welcome-card">
        <h2>Welcome to the Vue 3 + Pinia Frontend!</h2>
        <p>State management is now powered by Pinia stores.</p>
        
        <div class="status-grid">
          <div class="status-item">
            <span class="status-icon">✅</span>
            <span>Vite Dev Server</span>
          </div>
          <div class="status-item">
            <span class="status-icon">✅</span>
            <span>Hot Module Replacement</span>
          </div>
          <div class="status-item">
            <span class="status-icon">✅</span>
            <span>Vue 3 Composition API</span>
          </div>
          <div class="status-item">
            <span class="status-icon">✅</span>
            <span>Pinia State Management</span>
          </div>
        </div>

        <!-- Store Demo Section -->
        <div class="store-demo">
          <h3>📦 Pinia Store Demo</h3>
          
          <div class="demo-section">
            <h4>Pets Store</h4>
            <div class="stats">
              <div class="stat-item">
                <span class="stat-label">Total Pets:</span>
                <span class="stat-value">{{ petCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Filtered:</span>
                <span class="stat-value">{{ filteredCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Loading:</span>
                <span class="stat-value">{{ loading ? '⏳' : '✅' }}</span>
              </div>
            </div>
            
            <div class="status-breakdown">
              <h5>By Status:</h5>
              <div class="status-counts">
                <span v-for="(count, status) in petsByStatus" :key="status" class="status-badge">
                  {{ status }}: {{ count }}
                </span>
              </div>
            </div>

            <button @click="loadPets" class="demo-button" :disabled="loading">
              {{ loading ? 'Loading...' : 'Load Pets from API' }}
            </button>
          </div>

          <div class="demo-section">
            <h4>UI Store</h4>
            <div class="stats">
              <div class="stat-item">
                <span class="stat-label">Active Toasts:</span>
                <span class="stat-value">{{ toastCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Active Modals:</span>
                <span class="stat-value">{{ hasActiveModal ? '1+' : '0' }}</span>
              </div>
            </div>
            
            <div class="button-group">
              <button @click="showSuccessToast" class="demo-button success">
                Show Success
              </button>
              <button @click="showErrorToast" class="demo-button error">
                Show Error
              </button>
              <button @click="showInfoToast" class="demo-button info">
                Show Info
              </button>
            </div>
          </div>
        </div>
        
        <div class="info-box">
          <h3>Next Steps (FE-TECH-004):</h3>
          <ul>
            <li>Configure Vue Router for navigation</li>
            <li>Build AppShell layout component</li>
            <li>Extract PetList and Filters components</li>
            <li>Migrate existing functionality from static/app.js</li>
          </ul>
        </div>
      </div>
    </main>
    
    <footer class="app-footer">
      <p>Phase 1: Planning & Setup (FE-TECH-003) ✅</p>
    </footer>

    <!-- Toast Container -->
    <div class="toast-container">
      <div 
        v-for="toast in activeToasts" 
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`, { 'toast-dismissed': toast.dismissed }]"
      >
        <span class="toast-message">{{ toast.message }}</span>
        <button v-if="toast.dismissible" @click="dismissToast(toast.id)" class="toast-close">
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePetsStore, useUIStore } from '@/stores';

// Initialize stores
const petsStore = usePetsStore();
const uiStore = useUIStore();

// Destructure state and getters (reactive)
const { petCount, filteredCount, loading, petsByStatus } = storeToRefs(petsStore);
const { activeToasts, toastCount, hasActiveModal } = storeToRefs(uiStore);

// Actions (don't need storeToRefs)
const { fetchPets } = petsStore;
const { showSuccess, showError, showInfo, dismissToast } = uiStore;

// Methods
async function loadPets() {
  try {
    await fetchPets();
    showSuccess(`Loaded ${petCount.value} pets successfully!`);
  } catch (error) {
    showError(`Failed to load pets: ${error.message}`);
  }
}

function showSuccessToast() {
  showSuccess('This is a success message!');
}

function showErrorToast() {
  showError('This is an error message!');
}

function showInfoToast() {
  showInfo('This is an info message!');
}

onMounted(() => {
  console.log('🐾 Happy Paws Vue 3 + Pinia app mounted!');
  console.log('📦 Stores initialized:', { petsStore, uiStore });
  console.log('✨ State management ready');
});
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: #2c3e50;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  background: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 2.5rem;
  color: #667eea;
}

.subtitle {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 1.1rem;
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.welcome-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  max-width: 800px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.welcome-card h2 {
  margin-top: 0;
  color: #667eea;
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 2rem 0;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.status-icon {
  font-size: 1.5rem;
}

.store-demo {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
}

.store-demo h3 {
  margin-top: 0;
  color: #667eea;
}

.demo-section {
  margin: 1.5rem 0;
  padding: 1rem;
  background: white;
  border-radius: 6px;
}

.demo-section h4 {
  margin-top: 0;
  color: #444;
}

.stats {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f0f4ff;
  border-radius: 4px;
}

.stat-label {
  font-weight: 600;
  color: #666;
}

.stat-value {
  color: #667eea;
  font-weight: bold;
}

.status-breakdown {
  margin: 1rem 0;
}

.status-breakdown h5 {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.status-counts {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  background: #e9ecef;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #495057;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.demo-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: #667eea;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.demo-button:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-1px);
}

.demo-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.demo-button.success {
  background: #28a745;
}

.demo-button.success:hover {
  background: #218838;
}

.demo-button.error {
  background: #dc3545;
}

.demo-button.error:hover {
  background: #c82333;
}

.demo-button.info {
  background: #17a2b8;
}

.demo-button.info:hover {
  background: #138496;
}

.info-box {
  background: #f0f4ff;
  border-left: 4px solid #667eea;
  padding: 1.5rem;
  border-radius: 4px;
  margin-top: 2rem;
}

.info-box h3 {
  margin-top: 0;
  color: #667eea;
}

.info-box ul {
  margin-bottom: 0;
}

.info-box li {
  margin: 0.5rem 0;
}

.app-footer {
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

/* Toast Styles */
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toast {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  animation: slideIn 0.3s ease;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-dismissed {
  opacity: 0;
  transform: translateX(100%);
}

.toast-success {
  border-left: 4px solid #28a745;
}

.toast-error {
  border-left: 4px solid #dc3545;
}

.toast-warning {
  border-left: 4px solid #ffc107;
}

.toast-info {
  border-left: 4px solid #17a2b8;
}

.toast-message {
  flex: 1;
  color: #333;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.toast-close:hover {
  color: #333;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>


<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: #2c3e50;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  background: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 2.5rem;
  color: #667eea;
}

.subtitle {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 1.1rem;
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.welcome-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.welcome-card h2 {
  margin-top: 0;
  color: #667eea;
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 2rem 0;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.status-icon {
  font-size: 1.5rem;
}

.info-box {
  background: #f0f4ff;
  border-left: 4px solid #667eea;
  padding: 1.5rem;
  border-radius: 4px;
  margin-top: 2rem;
}

.info-box h3 {
  margin-top: 0;
  color: #667eea;
}

.info-box ul {
  margin-bottom: 0;
}

.info-box li {
  margin: 0.5rem 0;
}

.app-footer {
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}
</style>
