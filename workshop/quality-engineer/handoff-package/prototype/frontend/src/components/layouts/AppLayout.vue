<template>
  <div class="layout">
    <aside class="sidebar">
      <slot name="sidebar" />
    </aside>
    <section class="content">
      <slot />
    </section>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(220px, 300px) 1fr;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
