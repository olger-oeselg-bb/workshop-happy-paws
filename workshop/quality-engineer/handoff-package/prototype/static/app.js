const { createApp, ref, onMounted } = Vue

createApp({
  setup() {
    const pets = ref([])
    const currentPet = ref(null)
    const view = ref('list') // 'list' or 'profile'
    const form = ref({ name: '', type: 'Dog', breed: '', age: '', gender: 'Unknown', status: 'In Shelter', photoUrl: '' })
    const message = ref('')

    const load = async () => {
      const res = await fetch('/api/pets')
      pets.value = await res.json()
    }

    const loadPet = async (id) => {
      const res = await fetch(`/api/pets/${id}`)
      if (res.status === 200) {
        currentPet.value = await res.json()
        view.value = 'profile'
      } else {
        currentPet.value = null
        message.value = 'Pet not found.'
        view.value = 'list'
      }
    }

      const updateStatus = async (id, newStatus) => {
        const res = await fetch(`/api/pets/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) })
        if (res.status === 200) {
          const updated = await res.json()
          currentPet.value = updated
          await load()
        } else {
          const err = await res.json()
          message.value = err.error || 'Error updating status'
        }
      }

    const navigateTo = (hash) => {
      // treat empty hash, '#' or '#/' as the home (list) view
      if (!hash || hash === '#' || hash === '#/') {
        view.value = 'list'
        currentPet.value = null
        // ensure the canonical hash is '#/'
        if (location.hash !== '#/') location.replace('#/')
        return
      }

      // pet profile route: #/pet/{id}
      const m = hash.match(/^#\/pet\/(\d+)/)
      if (m) {
        loadPet(m[1])
        return
      }

      // unknown route: fallback to list
      view.value = 'list'
      currentPet.value = null
      if (location.hash !== '#/') location.replace('#/')
    }

    const openPet = (p) => {
      const h = '#/pet/' + p.id
      // set location.hash so hashchange handlers run naturally
      location.hash = h
    }

    const goHome = () => {
      const h = '#/'
      location.hash = h
    }

    const submit = async () => {
      message.value = ''
      if (!form.value.name || !form.value.type || !form.value.photoUrl) {
        message.value = 'Name, type and photo URL are required.'
        return
      }
      const res = await fetch('/api/pets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form.value) })
      if (res.status === 201) {
        const pet = await res.json()
        form.value = { name: '', type: 'Dog', breed: '', age: '', gender: 'Unknown', status: 'In Shelter', photoUrl: '' }
        await load()
        // navigate to profile of newly created pet via hash (triggers hashchange)
        location.hash = '#/pet/' + pet.id
      } else {
        const err = await res.json()
        message.value = err.error || 'Error'
      }
    }

    // handle back/forward
    window.addEventListener('popstate', () => navigateTo(location.hash))
    window.addEventListener('hashchange', () => navigateTo(location.hash))

    onMounted(async () => {
      await load()
      navigateTo(location.hash)
    })

    return { pets, form, message, submit, view, currentPet, navigateTo, openPet, goHome, updateStatus }
  },
  template: `
    <div class="container">
      <h1>Happy Paws — Prototype</h1>

      <template v-if="view==='list'">
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
            <div class="card" v-for="p in pets" :key="p.id" @click="openPet(p)">
              <img :src="p.photoUrl" :alt="p.name" />
              <div class="card-body">
                <h3>{{p.name}}</h3>
                <div style="margin:6px 0"><span :class="'badge ' + (p.status==='In Shelter' ? 'in-shelter' : p.status==='Pending Adoption' ? 'pending' : p.status==='Adopted' ? 'adopted' : 'not-available')">{{p.status}}</span></div>
                <div class="meta">{{p.type}} • {{p.breed}}</div>
              </div>
            </div>
          </div>
        </section>
      </template>

      <template v-else>
        <section class="profile">
          <button @click="goHome">← Back</button>
          <div v-if="currentPet">
            <h2>{{currentPet.name}}</h2>
            <img :src="currentPet.photoUrl" :alt="currentPet.name" style="max-width:200px" />
            <p><strong>Type:</strong> {{currentPet.type}}</p>
            <p><strong>Breed:</strong> {{currentPet.breed}}</p>
            <p><strong>Age:</strong> {{currentPet.age}}</p>
            <p><strong>Gender:</strong> {{currentPet.gender}}</p>
            <p>
              <strong>Status:</strong>
              <select :value="currentPet.status" @change="(e)=> updateStatus(currentPet.id, e.target.value)">
                <option>In Shelter</option>
                <option>Pending Adoption</option>
                <option>Adopted</option>
                <option>Not Available</option>
              </select>
            </p>
            <p><small>Added: {{currentPet.createdAt}}</small></p>
          </div>
          <div v-else>
            <p>Pet not found.</p>
          </div>
        </section>
      </template>
    </div>
  `
}).mount('#app')
