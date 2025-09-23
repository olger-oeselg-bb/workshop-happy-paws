const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const { initDb, getPets, addPet, resetDb } = require('./src/db')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// initialize DB and start server
async function start() {
  await initDb('db.json')

  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Prototype server running at http://localhost:${port}`))
}
start().catch(err => { console.error('Failed to start server', err); process.exit(1) })

app.use('/', express.static(path.join(__dirname, 'static')))

// APIs
app.get('/api/pets', async (req, res) => {
  const pets = await getPets()
  res.json(pets)
})

app.post('/api/pets', async (req, res) => {
  const { name, type, breed, age, gender, status, photoUrl } = req.body
  if (!name || !type || !photoUrl) {
    return res.status(400).json({ error: 'name, type and photoUrl are required' })
  }
  const pet = await addPet({ name, type, breed: breed || '', age: age || null, gender: gender || 'Unknown', status: status || 'In Shelter', photoUrl })
  res.status(201).json(pet)
})

app.post('/api/reset', async (req, res) => {
  await resetDb()
  res.json({ status: 'ok' })
})

// server started in start()
