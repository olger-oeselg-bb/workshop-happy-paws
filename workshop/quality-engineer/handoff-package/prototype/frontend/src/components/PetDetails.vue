<template>
  <div class="pet-details">
    <dl class="details-list">
      <div class="detail-row">
        <dt>Type</dt>
        <dd>{{ pet.type }}</dd>
      </div>
      <div class="detail-row">
        <dt>Breed</dt>
        <dd>{{ pet.breed || 'Unknown' }}</dd>
      </div>
      <div class="detail-row">
        <dt>Age</dt>
        <dd>{{ pet.age || 'Unlisted' }}</dd>
      </div>
      <div class="detail-row">
        <dt>Gender</dt>
        <dd>{{ pet.gender || 'Unknown' }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup>
defineProps({
  pet: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.pet-details {
  flex: 1;
}

.details-list {
  display: grid;
  gap: 1rem;
  margin: 0;
}

.detail-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0.75rem;
  align-items: center;
}

dt {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

dd {
  margin: 0;
  color: #111827;
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .detail-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  dt {
    font-size: 0.75rem;
    color: #6b7280;
  }

  dd {
    font-size: 0.875rem;
    color: #111827;
  }
}
</style>