const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// In-memory store
let pets = []
let idCounter = 1

app.use('/', express.static(path.join(__dirname, 'static')))

// APIs
app.get('/api/pets', (req, res) => {
  res.json(pets)
})

app.post('/api/pets', (req, res) => {
  const { name, type, breed, age, gender, status, photoUrl } = req.body
  if (!name || !type || !photoUrl) {
    return res.status(400).json({ error: 'name, type and photoUrl are required' })
  }
  const pet = { id: idCounter++, name, type, breed: breed || '', age: age || null, gender: gender || 'Unknown', status: status || 'In Shelter', photoUrl, createdAt: new Date().toISOString() }
  pets.push(pet)
  res.status(201).json(pet)
})

app.post('/api/reset', (req, res) => {
  pets = []
  idCounter = 1
  res.json({ status: 'ok' })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Prototype server running at http://localhost:${port}`))
