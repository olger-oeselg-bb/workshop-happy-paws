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

module.exports = { initDb, getPets, addPet, resetDb }
