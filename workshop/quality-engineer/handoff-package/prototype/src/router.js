const express = require('express')
const router = express.Router()
const { getPets, getPet, addPet, resetDb } = require('./db')
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
    console.error('POST /pets error', err)
    res.status(500).json({ error: 'internal' })
  }
})

router.post('/reset', async (req, res) => {
  try {
    await resetDb()
    res.json({ status: 'ok' })
  } catch (err) {
    console.error('POST /reset error', err)
    res.status(500).json({ error: 'internal' })
  }
})

module.exports = router
