const { createApp, ref, onMounted } = Vue

createApp({
  setup() {
    const pets = ref([])
    const form = ref({ name: '', type: 'Dog', breed: '', age: '', gender: 'Unknown', status: 'In Shelter', photoUrl: '' })
    const message = ref('')

    const load = async () => {
      const res = await fetch('/api/pets')
      pets.value = await res.json()
    }

    const submit = async () => {
      message.value = ''
      if (!form.value.name || !form.value.type || !form.value.photoUrl) {
        message.value = 'Name, type and photo URL are required.'
        return
      }
      const res = await fetch('/api/pets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form.value) })
      if (res.status === 201) {
        form.value = { name: '', type: 'Dog', breed: '', age: '', gender: 'Unknown', status: 'In Shelter', photoUrl: '' }
        await load()
      } else {
        const err = await res.json()
        message.value = err.error || 'Error'
      }
    }

    onMounted(load)
    return { pets, form, message, submit }
  },
  template: `
    <div class="container">
      <h1>Happy Paws — Prototype</h1>
      <section class="form">
        <h2>Add Pet</h2>
        <div class="field"><label>Name</label><input v-model="form.name" /></div>
        <div class="field"><label>Type</label><select v-model="form.type"><option>Dog</option><option>Cat</option><option>Other</option></select></div>
        <div class="field"><label>Breed</label><input v-model="form.breed" /></div>
        <div class="field"><label>Age</label><input v-model="form.age" /></div>
        <div class="field"><label>Gender</label><select v-model="form.gender"><option>Unknown</option><option>Male</option><option>Female</option></select></div>
        <div class="field"><label>Photo URL</label><input v-model="form.photoUrl" placeholder="https://..." /></div>
        <div class="actions"><button @click="submit">Save</button></div>
        <div class="message" aria-live="polite">{{message}}</div>
      </section>

      <section class="list">
        <h2>Pets</h2>
        <div v-if="pets.length===0">No pets yet.</div>
        <div class="cards">
          <div class="card" v-for="p in pets" :key="p.id">
            <img :src="p.photoUrl" :alt="p.name" />
            <div class="card-body">
              <h3>{{p.name}}</h3>
              <div class="meta">{{p.type}} • {{p.breed}} • {{p.status}}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
}).mount('#app')
