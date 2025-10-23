<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="brand">
        <router-link class="brand-link" :to="{ name: 'home' }">
          <span class="brand-icon" aria-hidden="true">🐾</span>
          <span class="brand-name">Happy Paws</span>
        </router-link>
        <p class="brand-tagline">Pet Registry System</p>
      </div>

      <nav class="nav">
        <router-link class="nav-link" :to="{ name: 'home' }">Pet List</router-link>
        <router-link class="nav-link" :to="{ name: 'add-pet' }">Add Pet</router-link>
      </nav>
    </header>

    <main class="app-main">
      <slot />
    </main>

    <footer class="app-footer">
      <p>Vue 3 + Pinia migration · Phase 2 in progress</p>
    </footer>

    <ToastRegion />
  </div>
</template>

<script setup>
import ToastRegion from './ToastRegion.vue';
</script>

<style scoped>
.app-shell {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  background: #f7f9fc;
  color: #1f2937;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
}

.brand {
  display: flex;
  flex-direction: column;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 700;
  color: #4c51bf;
}

.brand-icon {
  font-size: 1.5rem;
}

.brand-tagline {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.nav {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.nav-link {
  padding: 0.55rem 1rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  color: #4c51bf;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-link.router-link-active {
  background: rgba(76, 81, 191, 0.12);
  color: #3730a3;
}

.app-main {
  padding: 2rem clamp(1rem, 4vw, 3rem);
}

.app-footer {
  padding: 1.25rem 1.5rem;
  text-align: center;
  color: #6b7280;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 600px) {
  .nav {
    width: 100%;
  }

  .nav-link {
    flex: 1;
    text-align: center;
  }
}
</style>
