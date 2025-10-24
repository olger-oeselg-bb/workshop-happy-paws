<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-copy">
        <h2 class="hero-title">Discover adoptable pets</h2>
        <p class="hero-body">
          Browse the shelter roster, refine the list with filters, and jump straight into a pet profile.
        </p>
      </div>
      <router-link class="primary-action" :to="{ name: 'add-pet' }" aria-label="Add a new pet">
        Add Pet
      </router-link>
    </section>

    <PetFilters />
    <PetList />
  </div>
</template>

<script setup>
import PetFilters from '@/components/PetFilters.vue';
import PetList from '@/components/PetList.vue';
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-block: 1rem;
}

.hero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.18));
}

.hero-title {
  margin: 0;
  font-size: 1.75rem;
  color: #2c3e50;
}

.hero-body {
  margin: 0.5rem 0 0;
  max-width: 520px;
  color: #4a5568;
}

.primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.5rem;
  border-radius: 999px;
  background-color: #667eea;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(102, 126, 234, 0.3);
}
</style>
