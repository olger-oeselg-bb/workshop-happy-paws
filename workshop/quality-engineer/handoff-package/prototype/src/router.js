const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') })
const { getPets, getPet, addPet, updatePet, getMedicalRecords, addMedicalRecord, resetDb, addPhotoToPet, addAuditLog, getAuditLogs } = require('./db')
const logger = require('./logger')

router.get('/pets', async (req, res) => {
  try {
    // support query filters: type, breed (partial), status, minAge, maxAge, q (search by name)
    const { type, breed, status, minAge, maxAge, q } = req.query
    let pets = await getPets()

    if (q) {
      const term = String(q).toLowerCase()
      pets = pets.filter(p => (p.name || '').toLowerCase().includes(term))
    }

    if (type && type !== 'All') {
      pets = pets.filter(p => String(p.type || '') === String(type))
    }

    if (status && status !== 'All') {
      pets = pets.filter(p => String(p.status || '') === String(status))
    }

    if (breed) {
      const b = String(breed).toLowerCase()
      pets = pets.filter(p => (p.breed || '').toLowerCase().includes(b))
    }

    // age filtering: treat age as numeric when possible
    const min = minAge ? Number(minAge) : NaN
    const max = maxAge ? Number(maxAge) : NaN
    if (!Number.isNaN(min) || !Number.isNaN(max)) {
      pets = pets.filter(p => {
        const a = Number(p.age)
        if (Number.isNaN(a)) return false
        if (!Number.isNaN(min) && a < min) return false
        if (!Number.isNaN(max) && a > max) return false
        return true
      })
    }

    res.json(pets)
  } catch (err) {
    logger.error({ err }, 'GET /pets error')
    res.status(500).json({ error: 'internal' })
  }
})

router.get('/pets/:id', async (req, res) => {
  try {
    const pet = await getPet(req.params.id)
    if (!pet) return res.status(404).json({ error: 'not_found' })
    res.json(pet)
  } catch (err) {
    logger.error({ err }, 'GET /pets/:id error')
    res.status(500).json({ error: 'internal' })
  }
})

router.post('/pets', async (req, res) => {
  try {
    const { name, type, breed, age, gender, status, photoUrl } = req.body
    if (!name || !type || !photoUrl) {
      return res.status(400).json({ error: 'name, type and photoUrl are required' })
    }
    const pet = await addPet({ name, type, breed: breed || '', age: age || null, gender: gender || 'Unknown', status: status || 'In Shelter', photoUrl })
    res.status(201).json(pet)
  } catch (err) {
    logger.error({ err }, 'POST /pets error')
    res.status(500).json({ error: 'internal' })
  }
})

router.post('/reset', async (req, res) => {
  try {
    // allow optional seed name in body or query: ?seed=default or { seed: 'many' }
    const seed = (req.query && req.query.seed) || (req.body && req.body.seed)
    await resetDb(seed)
    res.json({ status: 'ok', seed: seed || 'none' })
  } catch (err) {
    logger.error({ err }, 'POST /reset error')
    res.status(500).json({ error: 'internal' })
  }
})

// Update pet (status changes allowed)
router.patch('/pets/:id', async (req, res) => {
  try {
    const { status } = req.body
    const allowed = ['In Shelter', 'Pending Adoption', 'Adopted', 'Not Available']
    if (!status || !allowed.includes(status)) return res.status(400).json({ error: 'invalid_status' })
    const updated = await updatePet(req.params.id, { status })
    if (!updated) return res.status(404).json({ error: 'not_found' })
  // record audit
  try { await addAuditLog(req.params.id, { type: 'status_change', detail: `Status changed to ${status}` }) } catch (e) { logger.warn({ e }, 'audit log failed') }
  res.json(updated)
  } catch (err) {
    logger.error({ err }, 'PATCH /pets/:id error')
    res.status(500).json({ error: 'internal' })
  }
})

// Medical records for a pet
router.get('/pets/:id/medical-records', async (req, res) => {
  try {
    const recs = await getMedicalRecords(req.params.id)
    res.json(recs)
  } catch (err) {
    logger.error({ err }, 'GET /pets/:id/medical-records error')
    res.status(500).json({ error: 'internal' })
  }
})

router.post('/pets/:id/medical-records', async (req, res) => {
  try {
    const { notes, vet, date, type } = req.body
    if (!notes) return res.status(400).json({ error: 'notes required' })
    const rec = await addMedicalRecord(req.params.id, { notes, vet: vet || '', date: date || new Date().toISOString(), type: type || 'note' })
    if (!rec) return res.status(404).json({ error: 'pet_not_found' })
  // record audit for medical record creation
  try { await addAuditLog(req.params.id, { type: 'medical_record_add', detail: `${type || 'note'} added: ${String(notes).slice(0,120)}` }) } catch (e) { logger.warn({ e }, 'audit log failed') }
    res.status(201).json(rec)
  } catch (err) {
    logger.error({ err }, 'POST /pets/:id/medical-records error')
    res.status(500).json({ error: 'internal' })
  }
})

// Photo upload for a pet (multipart/form-data)
router.post('/pets/:id/photos', upload.array('photos', 6), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'no_files' })
    const base = req.protocol + '://' + req.get('host')
    const urls = []
    for (const f of req.files) {
      const url = base + '/uploads/' + path.basename(f.path)
      const updated = await addPhotoToPet(req.params.id, url)
      if (!updated) return res.status(404).json({ error: 'pet_not_found' })
      urls.push(url)
    }
    res.status(201).json({ photos: urls })
  } catch (err) {
    logger.error({ err }, 'POST /pets/:id/photos error')
    res.status(500).json({ error: 'internal' })
  }
})

// List photos for a pet (returns pet.photos)
router.get('/pets/:id/photos', async (req, res) => {
  try {
    const pet = await getPet(req.params.id)
    if (!pet) return res.status(404).json({ error: 'not_found' })
    res.json({ photos: pet.photos || [] })
  } catch (err) {
    logger.error({ err }, 'GET /pets/:id/photos error')
    res.status(500).json({ error: 'internal' })
  }
})

// Audit logs for a pet
router.get('/pets/:id/audit', async (req, res) => {
  try {
    const logs = await getAuditLogs(req.params.id)
    res.json({ logs })
  } catch (err) {
    logger.error({ err }, 'GET /pets/:id/audit error')
    res.status(500).json({ error: 'internal' })
  }
})

module.exports = router


