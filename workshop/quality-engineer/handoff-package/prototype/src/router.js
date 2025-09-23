const express = require('express')
const router = express.Router()
const { getPets, getPet, addPet, updatePet, getMedicalRecords, addMedicalRecord, resetDb } = require('./db')
const logger = require('./logger')

router.get('/pets', async (req, res) => {
  try {
    const pets = await getPets()
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
    await resetDb()
    res.json({ status: 'ok' })
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
    res.status(201).json(rec)
  } catch (err) {
    logger.error({ err }, 'POST /pets/:id/medical-records error')
    res.status(500).json({ error: 'internal' })
  }
})

module.exports = router

