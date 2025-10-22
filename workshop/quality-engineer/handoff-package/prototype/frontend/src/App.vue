<template>
  <div class="app-container">
    <header class="app-header">
      <h1>🐾 Happy Paws</h1>
      <p class="subtitle">Pet Registry System - Vue 3 Migration</p>
    </header>
    
    <main class="main-content">
      <div class="welcome-card">
        <h2>Welcome to the Vue 3 Frontend!</h2>
        <p>This is a placeholder application demonstrating the Vite + Vue 3 setup.</p>
        
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
            <span class="status-icon">⏳</span>
            <span>API Proxy (Port 3000)</span>
          </div>
        </div>
        
        <div class="info-box">
          <h3>Next Steps (FE-TECH-003):</h3>
          <ul>
            <li>Set up Pinia stores for state management</li>
            <li>Configure Vue Router for navigation</li>
            <li>Build reusable components</li>
            <li>Migrate existing functionality from static/app.js</li>
          </ul>
        </div>
      </div>
    </main>
    
    <footer class="app-footer">
      <p>Phase 1: Planning & Setup (FE-TECH-002) ✅</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  console.log('🐾 Happy Paws Vue 3 app mounted successfully!');
  console.log('📦 Vite HMR enabled');
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
