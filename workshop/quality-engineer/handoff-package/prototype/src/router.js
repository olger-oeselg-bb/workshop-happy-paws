const express = require('express')
const router = express.Router()
const { getPets, addPet, resetDb } = require('./db')

router.get('/pets', async (req, res) => {
  try {
    const pets = await getPets()
    res.json(pets)
  } catch (err) {
    console.error('GET /pets error', err)
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
