const path = require('path')
const { JSONFilePreset } = require('lowdb/node')

let db

async function initDb(file = 'db.json') {
  const dbPath = path.join(__dirname, '..', file)
  // include medicalRecords and a separate counter
  db = await JSONFilePreset(dbPath, { pets: [], medicalRecords: [], idCounter: 1, medicalIdCounter: 1 })
  await db.read()
  db.data = db.data || { pets: [], medicalRecords: [], idCounter: 1, medicalIdCounter: 1 }
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

const seeds = require('./seeds')

async function resetDb(seedName) {
  // Reset pets and medical records with counters
  if (seedName && seeds[seedName]) {
    db.data = JSON.parse(JSON.stringify(seeds[seedName]))
  } else {
    db.data = { pets: [], medicalRecords: [], idCounter: 1, medicalIdCounter: 1 }
  }
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

async function getMedicalRecords(petId) {
  await db.read()
  const pid = typeof petId === 'string' ? parseInt(petId, 10) : petId
  return (db.data.medicalRecords || []).filter(r => r.petId === pid)
}

async function addMedicalRecord(petId, record) {
  await db.read()
  const pid = typeof petId === 'string' ? parseInt(petId, 10) : petId
  // ensure pet exists
  const pet = db.data.pets.find(p => p.id === pid)
  if (!pet) return null
  // defensive initialization in case resetDb or older data missed these fields
  db.data.medicalRecords = db.data.medicalRecords || []
  db.data.medicalIdCounter = db.data.medicalIdCounter || 1
  const newRec = { id: db.data.medicalIdCounter++, petId: pid, ...record, createdAt: new Date().toISOString() }
  db.data.medicalRecords.push(newRec)
  await db.write()
  return newRec
}

module.exports = { initDb, getPets, getPet, addPet, updatePet, getMedicalRecords, addMedicalRecord, resetDb }
