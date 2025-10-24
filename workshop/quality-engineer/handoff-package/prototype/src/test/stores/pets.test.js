import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePetsStore } from '@/stores/pets'

// Mock the API
vi.mock('@/api', () => ({
  petsApi: {
    fetchPets: vi.fn(),
    fetchPetById: vi.fn(),
    createPet: vi.fn(),
    updatePet: vi.fn()
  }
}))

// Mock the UI store
const mockUIStore = {
  showError: vi.fn(),
  showSuccess: vi.fn()
}

vi.mock('@/stores/ui', () => ({
  useUIStore: vi.fn(() => mockUIStore)
}))

import { petsApi } from '@/api'

describe('usePetsStore', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = usePetsStore()

    // Reset all mocks
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('has correct initial values', () => {
      expect(store.pets).toEqual([])
      expect(store.activePet).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.petCount).toBe(0)
      expect(store.filteredCount).toBe(0)
    })

    it('has correct initial filters', () => {
      expect(store.filters).toEqual({
        search: '',
        type: 'All',
        status: 'All',
        breed: '',
        minAge: null,
        maxAge: null
      })
    })
  })

  describe('filteredPets', () => {
    beforeEach(() => {
      store.pets = [
        { id: 1, name: 'Buddy', type: 'Dog', status: 'In Shelter', breed: 'Golden Retriever', age: 2 },
        { id: 2, name: 'Whiskers', type: 'Cat', status: 'Pending Adoption', breed: 'Siamese', age: 1 },
        { id: 3, name: 'Max', type: 'Dog', status: 'Adopted', breed: 'Labrador', age: 3 }
      ]
    })

    it('returns all pets when no filters applied', () => {
      expect(store.filteredPets).toHaveLength(3)
    })

    it('filters by search term', () => {
      store.setFilters({ search: 'Buddy' })
      expect(store.filteredPets).toHaveLength(1)
      expect(store.filteredPets[0].name).toBe('Buddy')
    })

    it('filters by type', () => {
      store.setFilters({ type: 'Cat' })
      expect(store.filteredPets).toHaveLength(1)
      expect(store.filteredPets[0].type).toBe('Cat')
    })

    it('filters by status', () => {
      store.setFilters({ status: 'Adopted' })
      expect(store.filteredPets).toHaveLength(1)
      expect(store.filteredPets[0].status).toBe('Adopted')
    })

    it('filters by breed', () => {
      store.setFilters({ breed: 'Labrador' })
      expect(store.filteredPets).toHaveLength(1)
      expect(store.filteredPets[0].breed).toBe('Labrador')
    })

    it('filters by age range', () => {
      store.setFilters({ minAge: 2, maxAge: 3 })
      expect(store.filteredPets).toHaveLength(2)
      expect(store.filteredPets.map(p => p.name)).toEqual(['Buddy', 'Max'])
    })
  })

  describe('petsByStatus', () => {
    it('counts pets by status correctly', () => {
      store.pets = [
        { status: 'In Shelter' },
        { status: 'In Shelter' },
        { status: 'Pending Adoption' },
        { status: 'Adopted' }
      ]

      const statusCounts = store.petsByStatus
      expect(statusCounts['In Shelter']).toBe(2)
      expect(statusCounts['Pending Adoption']).toBe(1)
      expect(statusCounts['Adopted']).toBe(1)
      expect(statusCounts['Not Available']).toBe(0)
    })
  })

  describe('actions', () => {
    describe('fetchPets', () => {
      it('fetches pets successfully', async () => {
        const mockPets = [{ id: 1, name: 'Test Pet' }]
        petsApi.fetchPets.mockResolvedValue(mockPets)

        const result = await store.fetchPets()

        expect(petsApi.fetchPets).toHaveBeenCalledWith({})
        expect(store.pets).toEqual(mockPets)
        expect(store.loading).toBe(false)
        expect(result).toEqual(mockPets)
      })

      it('handles fetch error', async () => {
        const errorMessage = 'Network error'
        petsApi.fetchPets.mockRejectedValue(new Error(errorMessage))

        await expect(store.fetchPets()).rejects.toThrow(errorMessage)
        expect(store.error).toBe(errorMessage)
        expect(store.loading).toBe(false)
        expect(mockUIStore.showError).toHaveBeenCalledWith(`Failed to load pets: ${errorMessage}`)
      })
    })

    describe('createPet', () => {
      it('creates pet successfully', async () => {
        const newPet = { id: 1, name: 'New Pet' }
        const petData = { name: 'New Pet', type: 'Dog' }
        petsApi.createPet.mockResolvedValue(newPet)

        const result = await store.createPet(petData)

        expect(petsApi.createPet).toHaveBeenCalledWith(petData)
        expect(store.pets).toHaveLength(1)
        expect(store.pets[0]).toEqual(newPet)
        expect(store.loading).toBe(false)
        expect(result).toEqual(newPet)
        expect(mockUIStore.showSuccess).toHaveBeenCalledWith('New Pet has been added successfully!')
      })

      it('handles create error', async () => {
        const errorMessage = 'Validation error'
        const petData = { name: '', type: 'Dog' }
        petsApi.createPet.mockRejectedValue(new Error(errorMessage))

        await expect(store.createPet(petData)).rejects.toThrow(errorMessage)
        expect(store.error).toBe(errorMessage)
        expect(mockUIStore.showError).toHaveBeenCalledWith(`Failed to add pet: ${errorMessage}`)
      })
    })

    describe('setFilters', () => {
      it('updates filters correctly', () => {
        store.setFilters({ search: 'test', type: 'Dog' })
        expect(store.filters.search).toBe('test')
        expect(store.filters.type).toBe('Dog')
        expect(store.filters.status).toBe('All') // unchanged
      })
    })

    describe('resetFilters', () => {
      it('resets all filters to default values', () => {
        store.setFilters({ search: 'test', type: 'Dog', status: 'Adopted' })
        store.resetFilters()

        expect(store.filters).toEqual({
          search: '',
          type: 'All',
          status: 'All',
          breed: '',
          minAge: null,
          maxAge: null
        })
      })
    })
  })
})