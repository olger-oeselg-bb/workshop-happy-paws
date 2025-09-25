const { createApp, ref, onMounted } = Vue

createApp({
  setup() {
    const pets = ref([])
  const filters = ref({ q: '', type: 'All', status: 'All', breed: '', minAge: '', maxAge: '' })
    const currentPet = ref(null)
    const view = ref('list') // 'list' or 'profile'
  const form = ref({ name: '', type: 'Dog', breed: '', age: '', gender: 'Unknown', status: 'In Shelter', photoUrl: '', photos: [] })
    const addPhotosQueue = ref([]) // File objects selected in Add form
  const addPhotoPreviews = ref([])

    const onAddPhotosChange = (e) => {
      const files = Array.from(e.target.files || [])
      // revoke old previews
      addPhotoPreviews.value.forEach(u => { try { URL.revokeObjectURL(u) } catch (e) {} })
      addPhotosQueue.value = files
      addPhotoPreviews.value = files.map(f => URL.createObjectURL(f))
    }

    const uploadPhotosForPet = async (files, petId) => {
      if (!files || files.length === 0) return null
      const fd = new FormData()
      for (const f of files) fd.append('photos', f)
      const res = await fetch(`/api/pets/${petId}/photos`, { method: 'POST', body: fd })
      if (res.status === 201) return await res.json()
      const err = await res.json()
      throw new Error(err.error || 'upload_failed')
    }
  const message = ref('')
  const toast = ref('')
  const lightbox = ref({ open: false, src: null })
  const profileFileInput = ref(null)

    const onProfileFilesChange = async (e) => {
      const files = Array.from(e.target.files || [])
      if (!files.length) return
      try {
        await uploadPhotosForPet(files, currentPet.value.id)
        await loadPet(currentPet.value.id)
        toast.value = 'Photos uploaded'
        setTimeout(() => { toast.value = '' }, 2500)
      } catch (err) {
        message.value = err.message || String(err)
      } finally {
        // reset file input so same file can be selected again if needed
        if (profileFileInput.value) profileFileInput.value.value = ''
      }
    }

    const triggerProfileUpload = () => {
      if (profileFileInput.value) profileFileInput.value.click()
    }

    const openLightbox = (src) => {
      lightbox.value.open = true
      lightbox.value.src = src
    }

    const closeLightbox = () => {
      lightbox.value.open = false
      lightbox.value.src = null
    }

    const buildQuery = () => {
      const s = []
      Object.entries(filters.value).forEach(([k, v]) => {
        if (v !== null && v !== undefined && String(v).trim() !== '') s.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      })
      return s.length ? `?${s.join('&')}` : ''
    }

    const load = async () => {
      const q = buildQuery()
      const res = await fetch('/api/pets' + q)
      pets.value = await res.json()
    }

    const loadPet = async (id) => {
      const res = await fetch(`/api/pets/${id}`)
      if (res.status === 200) {
        currentPet.value = await res.json()
        view.value = 'profile'
        // load medical records for this pet
        await loadMedical(id)
        // clear toast when loading profile
        toast.value = ''
      } else {
        currentPet.value = null
        message.value = 'Pet not found.'
        view.value = 'list'
      }
    }

      const medicalRecords = ref([])
      const medForm = ref({ notes: '', vet: '', date: '', type: 'note' })

      const loadMedical = async (petId) => {
        const res = await fetch(`/api/pets/${petId}/medical-records`)
        if (res.status === 200) {
          medicalRecords.value = await res.json()
        } else {
          medicalRecords.value = []
        }
      }

      const addMedical = async (petId) => {
        if (!medForm.value.notes) { message.value = 'Notes required'; return }
        const res = await fetch(`/api/pets/${petId}/medical-records`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(medForm.value) })
        if (res.status === 201) {
          const rec = await res.json()
          medicalRecords.value.push(rec)
          medForm.value = { notes: '', vet: '', date: '', type: 'note' }
        } else {
          const err = await res.json()
          message.value = err.error || 'Error adding record'
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
        // clear medical records when returning home
        medicalRecords.value = []
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

      // add pet route
      if (hash === '#/add') {
        view.value = 'add'
        currentPet.value = null
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
      if (!form.value.name || !form.value.type) {
        message.value = 'Name and type are required.'
        return
      }
      const res = await fetch('/api/pets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form.value) })
      if (res.status === 201) {
        const pet = await res.json()
        // if we have files queued, upload them
          if (addPhotosQueue.value.length) {
          try {
            await uploadPhotosForPet(addPhotosQueue.value, pet.id)
          } catch (err) {
            console.error(err)
          }
        }
        form.value = { name: '', type: 'Dog', breed: '', age: '', gender: 'Unknown', status: 'In Shelter', photoUrl: '' , photos: [] }
        // revoke previews and clear queues
        addPhotoPreviews.value.forEach(u => { try { URL.revokeObjectURL(u) } catch (e) {} })
        addPhotoPreviews.value = []
        addPhotosQueue.value = []
        await load()
        // navigate to profile of newly created pet via hash (triggers hashchange)
        location.hash = '#/pet/' + pet.id
      } else {
        const err = await res.json()
        message.value = err.error || 'Error'
      }
    }

    // return a gallery array that includes the primary photoUrl followed by photos[], de-duped
    const galleryPhotos = () => {
      if (!currentPet.value) return []
      const list = []
      if (currentPet.value.photoUrl) list.push(currentPet.value.photoUrl)
      if (Array.isArray(currentPet.value.photos)) {
        for (const p of currentPet.value.photos) {
          if (p && !list.includes(p)) list.push(p)
        }
      }
      return list
    }

    const goToAdd = () => { location.hash = '#/add' }

    const resetFilters = async () => {
      filters.value = { q: '', type: 'All', status: 'All', breed: '', minAge: '', maxAge: '' }
      await load()
    }

    // handle back/forward
    window.addEventListener('popstate', () => navigateTo(location.hash))
    window.addEventListener('hashchange', () => navigateTo(location.hash))

    onMounted(async () => {
      await load()
      navigateTo(location.hash)
    })
  return { pets, filters, resetFilters, load, form, message, toast, lightbox, submit, view, currentPet, navigateTo, openPet, goHome, goToAdd, updateStatus, medicalRecords, medForm, addMedical, loadMedical, addPhotosQueue, onAddPhotosChange, uploadPhotosForPet, profileFileInput, onProfileFilesChange, triggerProfileUpload, openLightbox, closeLightbox, galleryPhotos }
  },
  template: `
    <div class="container">
      <h1>Happy Paws — Prototype</h1>

      <template v-if="view==='list'">
        <section class="list">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h2>Pets</h2>
            <div class="actions"><button @click="goToAdd">Add Pet</button></div>
          </div>

          <!-- Filters -->
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0;align-items:center">
            <input placeholder="Search by name" v-model="filters.q" @input="load" style="padding:8px;border:1px solid #ddd;border-radius:6px;min-width:180px" />
            <select v-model="filters.type" @change="load" style="padding:8px;border:1px solid #ddd;border-radius:6px">
              <option>All</option>
              <option>Dog</option>
              <option>Cat</option>
              <option>Other</option>
            </select>
            <select v-model="filters.status" @change="load" style="padding:8px;border:1px solid #ddd;border-radius:6px">
              <option>All</option>
              <option>In Shelter</option>
              <option>Pending Adoption</option>
              <option>Adopted</option>
              <option>Not Available</option>
            </select>
            <input placeholder="Breed (partial)" v-model="filters.breed" @input="load" style="padding:8px;border:1px solid #ddd;border-radius:6px;min-width:160px" />
            <input placeholder="Min age" v-model="filters.minAge" @input="load" style="width:80px;padding:8px;border:1px solid #ddd;border-radius:6px" />
            <input placeholder="Max age" v-model="filters.maxAge" @input="load" style="width:80px;padding:8px;border:1px solid #ddd;border-radius:6px" />
            <button class="btn-back" @click="resetFilters">Reset</button>
          </div>

          <div v-if="pets.length===0">No pets found.</div>
          <div class="cards">
            <div class="card" v-for="p in pets" :key="p.id" @click="openPet(p)">
              <img :src="(p.photoUrl || (p.photos && p.photos[0]) || '/placeholder.png')" :alt="p.name" />
              <div class="card-body">
                <h3>{{p.name}}</h3>
                <div style="margin:6px 0"><span :class="'badge ' + (p.status==='In Shelter' ? 'in-shelter' : p.status==='Pending Adoption' ? 'pending' : p.status==='Adopted' ? 'adopted' : 'not-available')">{{p.status}}</span></div>
                <div class="meta">{{p.type}} • {{p.breed}}</div>
              </div>
            </div>
          </div>
        </section>
      </template>

      <template v-else-if="view==='add'">
        <section class="form">
          <h2>Add Pet</h2>
          <div class="field"><label>Name</label><input v-model="form.name" /></div>
          <div class="field"><label>Type</label><select v-model="form.type"><option>Dog</option><option>Cat</option><option>Other</option></select></div>
          <div class="field"><label>Breed</label><input v-model="form.breed" /></div>
          <div class="field"><label>Age</label><input v-model="form.age" /></div>
          <div class="field"><label>Gender</label><select v-model="form.gender"><option>Unknown</option><option>Male</option><option>Female</option></select></div>
          <div class="field"><label>Photo URL (optional)</label><input v-model="form.photoUrl" placeholder="https://..." /></div>
          <div class="field"><label>Upload photos (optional)</label><input type="file" multiple accept="image/*" @change="onAddPhotosChange" /></div>
            <div style="display:flex;gap:8px;margin-bottom:8px">
            <div v-for="(u, idx) in addPhotoPreviews" :key="idx" style="width:80px;height:80px;overflow:hidden;border-radius:6px;border:1px solid #eee;display:flex;align-items:center;justify-content:center;background:#fafafa">
              <img :src="u" style="width:100%;height:100%;object-fit:cover" />
            </div>
          </div>
          <div class="actions"><button @click="submit">Save</button> <button class="btn-back" @click="goHome">Cancel</button></div>
          <div class="message" aria-live="polite">{{message}}</div>
        </section>
      </template>

      <template v-else>
        <section class="profile">
          <button class="btn-back" @click="goHome">← Back</button>
          <div v-if="currentPet">
            <h2>{{currentPet.name}}</h2>
            <div style="display:flex;gap:8px;align-items:flex-start">
              <img :src="currentPet.photoUrl" :alt="currentPet.name" style="max-width:200px;border-radius:6px;cursor:pointer" @click="openLightbox(currentPet.photoUrl)" />
              <div style="display:flex;flex-direction:column;gap:8px">
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  <img v-for="(ph, idx) in galleryPhotos()" :key="ph" :src="ph" @click="openLightbox(ph)" style="width:80px;height:80px;object-fit:cover;border-radius:6px;border:1px solid #eee;cursor:pointer" />
                </div>
                <div>
                  <label style="font-size:13px">Upload photos</label>
                  <input ref="profileFileInput" type="file" multiple accept="image/*" style="display:none" @change="onProfileFilesChange" />
                  <div style="display:flex;gap:8px;align-items:center">
                    <button class="upload-btn" @click="triggerProfileUpload">Upload photos</button>
                    <div style="font-size:12px;color:#666">(or drag & drop not supported in prototype)</div>
                  </div>
                </div>
              </div>
            </div>
            <p><strong>Type:</strong> {{currentPet.type}}</p>
            <p><strong>Breed:</strong> {{currentPet.breed}}</p>
            <p><strong>Age:</strong> {{currentPet.age}}</p>
            <p><strong>Gender:</strong> {{currentPet.gender}}</p>
            <p style="display:flex;align-items:center;gap:12px">
              <strong>Status:</strong>
              <!-- badge shows current status with same colors as list -->
              <span :class="'badge ' + (currentPet.status==='In Shelter' ? 'in-shelter' : currentPet.status==='Pending Adoption' ? 'pending' : currentPet.status==='Adopted' ? 'adopted' : 'not-available')">{{currentPet.status}}</span>
              <!-- nicer styled select; class matches badge variant for subtle visual cue -->
              <select :value="currentPet.status" @change="(e)=> updateStatus(currentPet.id, e.target.value)" :class="'status-select ' + (currentPet.status==='In Shelter' ? 'in-shelter' : currentPet.status==='Pending Adoption' ? 'pending' : currentPet.status==='Adopted' ? 'adopted' : 'not-available')">
                <option>In Shelter</option>
                <option>Pending Adoption</option>
                <option>Adopted</option>
                <option>Not Available</option>
              </select>
            </p>
            <p><small>Added: {{currentPet.createdAt}}</small></p>
            <section style="margin-top:12px">
              <h3>Medical records</h3>
              <div v-if="medicalRecords.length===0">No records yet.</div>
              <ul>
                <li v-for="r in medicalRecords" :key="r.id"><strong>{{r.type}}</strong> — {{r.notes}} <small>({{r.vet}} {{r.date}})</small></li>
              </ul>
              <div style="margin-top:8px">
                <h4>Add record</h4>
                <div class="field"><label>Notes</label><textarea v-model="medForm.notes"></textarea></div>
                <div class="field"><label>Vet</label><input v-model="medForm.vet" /></div>
                <div class="field"><label>Date</label><input v-model="medForm.date" placeholder="YYYY-MM-DD" /></div>
                <div class="actions"><button @click="addMedical(currentPet.id)">Add Record</button></div>
              </div>
            </section>
          </div>
          <div v-else>
            <p>Pet not found.</p>
          </div>
        </section>
      </template>
    </div>
    <div v-if="toast" class="toast-success" role="status" aria-live="polite">{{toast}}</div>

    <div v-if="lightbox.open" class="lb-backdrop" @click="closeLightbox">
      <div class="lb-content" @click.stop>
        <img :src="lightbox.src" style="max-width:90vw;max-height:80vh;object-fit:contain" />
      </div>
    </div>
  `
}).mount('#app')
