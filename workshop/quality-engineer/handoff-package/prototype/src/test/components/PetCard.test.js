import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import PetCard from '@/components/PetCard.vue'

// Mock router
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { name: 'pet-profile', path: '/pets/:id', component: {} }
  ]
})

describe('PetCard', () => {
  const mockPet = {
    id: 1,
    name: 'Buddy',
    type: 'Dog',
    breed: 'Golden Retriever',
    status: 'In Shelter',
    photoUrl: '/images/buddy.jpg'
  }

  it('renders pet information correctly', () => {
    const wrapper = mount(PetCard, {
      props: { pet: mockPet },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Buddy')
    expect(wrapper.text()).toContain('Dog')
    expect(wrapper.text()).toContain('Golden Retriever')
    expect(wrapper.text()).toContain('In Shelter')
  })

  it('displays placeholder image when no photoUrl is provided', () => {
    const petWithoutPhoto = { ...mockPet, photoUrl: null }
    const wrapper = mount(PetCard, {
      props: { pet: petWithoutPhoto },
      global: {
        plugins: [router]
      }
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('/images/placeholder.svg')
  })

  it('applies correct status class', () => {
    const wrapper = mount(PetCard, {
      props: { pet: mockPet },
      global: {
        plugins: [router]
      }
    })

    const statusBadge = wrapper.find('.status-badge')
    expect(statusBadge.classes()).toContain('status-in-shelter')
  })

  it('emits select event when clicked', async () => {
    const wrapper = mount(PetCard, {
      props: { pet: mockPet },
      global: {
        plugins: [router]
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')[0]).toEqual([mockPet])
  })

  it('emits select event when Enter key is pressed', async () => {
    const wrapper = mount(PetCard, {
      props: { pet: mockPet },
      global: {
        plugins: [router]
      }
    })

    await wrapper.trigger('keydown.enter')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')[0]).toEqual([mockPet])
  })

  it('emits select event when Space key is pressed', async () => {
    const wrapper = mount(PetCard, {
      props: { pet: mockPet },
      global: {
        plugins: [router]
      }
    })

    await wrapper.trigger('keydown.space')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')[0]).toEqual([mockPet])
  })

  it('has correct accessibility attributes', () => {
    const wrapper = mount(PetCard, {
      props: { pet: mockPet },
      global: {
        plugins: [router]
      }
    })

    const card = wrapper.find('.pet-card')
    expect(card.attributes('role')).toBe('button')
    expect(card.attributes('tabindex')).toBe('0')
    expect(card.attributes('aria-label')).toBe('View profile for Buddy, Dog, status: In Shelter')
  })

  it('renders router link with correct props', () => {
    const wrapper = mount(PetCard, {
      props: { pet: mockPet },
      global: {
        plugins: [router]
      }
    })

    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.props('to')).toEqual({ name: 'pet-profile', params: { id: 1 } })
  })
})