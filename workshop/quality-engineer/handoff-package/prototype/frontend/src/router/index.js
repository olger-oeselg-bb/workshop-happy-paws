import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AddPetView from '@/views/AddPetView.vue';
import PetProfileView from '@/views/PetProfileView.vue';
import { usePetsStore, useUIStore } from '@/stores';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Pet Registry' }
    },
    {
      path: '/add',
      name: 'add-pet',
      component: AddPetView,
      meta: { title: 'Add Pet' }
    },
    {
      path: '/pet/:id(\\d+)',
      name: 'pet-profile',
      component: PetProfileView,
      props: true,
      meta: { title: 'Pet Profile' }
    }
  ],
  scrollBehavior() {
    return { top: 0, left: 0, behavior: 'smooth' };
  }
});

router.beforeEach(async (to, from, next) => {
  const petsStore = usePetsStore();
  const uiStore = useUIStore();

  // Support legacy hash links by redirecting when hash matches a known route
  if (to.hash && to.hash.startsWith('#/')) {
    const hashPath = to.hash.slice(1);
    return next(hashPath || '/');
  }

  try {
    // Ensure pet collection is loaded for routes that depend on it
    if (!petsStore.pets.length) {
      await petsStore.fetchPets();
    }

    if (to.name === 'home') {
      petsStore.clearActivePet();
    }

    if (to.name === 'add-pet') {
      petsStore.clearActivePet();
    }

    if (to.name === 'pet-profile') {
      const petId = Number(to.params.id);
      if (!Number.isInteger(petId)) {
        uiStore.showError('Invalid pet id.');
        return next({ name: 'home' });
      }

      // Fetch pet details when navigating directly or switching profiles
      if (!petsStore.activePet || petsStore.activePet.id !== petId) {
        await petsStore.fetchPetById(petId);
      }
    }

    return next();
  } catch (error) {
    uiStore.showError(error?.message || 'Unable to navigate to the requested page.');
    if (to.name !== 'home') {
      return next({ name: 'home' });
    }
    return next(false);
  }
});

export default router;
