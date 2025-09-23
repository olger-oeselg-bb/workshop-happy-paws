const path = require('path')
const { JSONFilePreset } = require('lowdb/node')

let db

async function initDb(file = 'db.json') {
  const dbPath = path.join(__dirname, '..', file)
  db = await JSONFilePreset(dbPath, { pets: [], idCounter: 1 })
  await db.read()
  db.data = db.data || { pets: [], idCounter: 1 }
  await db.write()
  return db
}

async function getPets() {
  await db.read()
  return db.data.pets
}

async function getPet(id) {
  await db.read()
  const pid = typeof id === 'string' ? parseInt(id, 10) : id
  return db.data.pets.find(p => p.id === pid) || null
}

async function addPet(pet) {
  await db.read()
  const newPet = { id: db.data.idCounter++, ...pet, createdAt: new Date().toISOString() }
  db.data.pets.push(newPet)
  await db.write()
  return newPet
}

async function resetDb() {
  db.data = { pets: [], idCounter: 1 }
  await db.write()
}

async function updatePet(id, changes) {
  await db.read()
  const pid = typeof id === 'string' ? parseInt(id, 10) : id
  const idx = db.data.pets.findIndex(p => p.id === pid)
  if (idx === -1) return null
  db.data.pets[idx] = { ...db.data.pets[idx], ...changes }
  await db.write()
  return db.data.pets[idx]
}

module.exports = { initDb, getPets, getPet, addPet, updatePet, resetDb }
