const path = require('path')
const { JSONFilePreset } = require('lowdb/node')

let db

async function initDb(file = 'db.json') {
  const dbPath = path.join(__dirname, '..', file)
  // include medicalRecords and a separate counter
  db = await JSONFilePreset(dbPath, { pets: [], medicalRecords: [], auditLogs: [], idCounter: 1, medicalIdCounter: 1, auditIdCounter: 1 })
  await db.read()
  db.data = db.data || { pets: [], medicalRecords: [], auditLogs: [], idCounter: 1, medicalIdCounter: 1, auditIdCounter: 1 }
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
  // ensure photos array
  const withPhotos = { ...pet, photos: pet.photos || [], photoUrl: pet.photoUrl || (pet.photos && pet.photos[0]) }
  const newPet = { id: db.data.idCounter++, ...withPhotos, createdAt: new Date().toISOString() }
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
    db.data = { pets: [], medicalRecords: [], auditLogs: [], idCounter: 1, medicalIdCounter: 1, auditIdCounter: 1 }
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

async function addPhotoToPet(id, photoUrl) {
  await db.read()
  const pid = typeof id === 'string' ? parseInt(id, 10) : id
  const pet = db.data.pets.find(p => p.id === pid)
  if (!pet) return null
  pet.photos = pet.photos || []
  pet.photos.push(photoUrl)
  // set primary photoUrl if not present
  if (!pet.photoUrl) pet.photoUrl = photoUrl
  await db.write()
  return pet
}

async function addAuditLog(petId, entry) {
  await db.read()
  db.data.auditLogs = db.data.auditLogs || []
  db.data.auditIdCounter = db.data.auditIdCounter || 1
  const id = db.data.auditIdCounter++
  const log = { id, petId: typeof petId === 'string' ? parseInt(petId, 10) : petId, ...entry, createdAt: new Date().toISOString() }
  db.data.auditLogs.push(log)
  await db.write()
  return log
}

async function getAuditLogs(petId) {
  await db.read()
  const pid = typeof petId === 'string' ? parseInt(petId, 10) : petId
  return (db.data.auditLogs || []).filter(a => a.petId === pid).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
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

async function updateMedicalRecord(recordId, updates) {
  await db.read()
  const rid = typeof recordId === 'string' ? parseInt(recordId, 10) : recordId
  const idx = db.data.medicalRecords.findIndex(r => r.id === rid)
  if (idx === -1) return null
  db.data.medicalRecords[idx] = { ...db.data.medicalRecords[idx], ...updates }
  await db.write()
  return db.data.medicalRecords[idx]
}

async function deleteMedicalRecord(recordId) {
  await db.read()
  const rid = typeof recordId === 'string' ? parseInt(recordId, 10) : recordId
  const idx = db.data.medicalRecords.findIndex(r => r.id === rid)
  if (idx === -1) return false
  db.data.medicalRecords.splice(idx, 1)
  await db.write()
  return true
}

module.exports = { initDb, getPets, getPet, addPet, updatePet, getMedicalRecords, addMedicalRecord, resetDb, addPhotoToPet, addAuditLog, getAuditLogs, updateMedicalRecord, deleteMedicalRecord }
