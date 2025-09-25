// Named seed datasets for tests and QA
module.exports = {
  default: {
    pets: [
      { id: 1, name: 'Sofia', type: 'Dog', breed: 'Labrador', age: 3, gender: 'Female', status: 'In Shelter', photoUrl: 'https://place-puppy.com/200x200', createdAt: new Date().toISOString() },
      { id: 2, name: 'Mittens', type: 'Cat', breed: 'Siamese', age: 2, gender: 'Male', status: 'Pending Adoption', photoUrl: 'https://placekitten.com/200/200', createdAt: new Date().toISOString() },
      { id: 3, name: 'Biscuit', type: 'Dog', breed: 'Beagle', age: 5, gender: 'Male', status: 'Adopted', photoUrl: 'https://place-puppy.com/201x201', createdAt: new Date().toISOString() }
    ],
    medicalRecords: [
      { id: 1, petId: 1, notes: 'Vaccinated', vet: 'Dr. Karl', date: '2025-08-15', type: 'vaccine', createdAt: new Date().toISOString() }
    ],
    idCounter: 4,
    medicalIdCounter: 2
  },
  minimal: {
    pets: [],
    medicalRecords: [],
    idCounter: 1,
    medicalIdCounter: 1
  },
  many: (function manySeed(){
    const pets = []
    for (let i=1;i<=12;i++) pets.push({ id:i, name:`Pet ${i}`, type: i%2===0 ? 'Cat' : 'Dog', breed: i%3===0 ? 'Mixed' : 'Breed'+i, age: i%7, gender: i%2===0?'Female':'Male', status: i%4===0?'Adopted':(i%3===0?'Pending Adoption':'In Shelter'), photoUrl: 'https://placekitten.com/200/200', createdAt: new Date().toISOString() })
    return { pets, medicalRecords: [], idCounter: 13, medicalIdCounter: 1 }
  })()
}
