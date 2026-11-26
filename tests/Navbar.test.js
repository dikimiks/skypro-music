import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Navbar from '../components/Navbar.vue'

describe('Navbar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage.removeItem('skypro-theme')
  })

  afterEach(() => {
    delete document.documentElement.dataset.theme
  })

  it('opens and closes menu by click', async () => {
    const wrapper = mount(Navbar, {
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } },
    })

    expect(wrapper.find('#main-menu').exists()).toBe(false)
    await wrapper.find('.nav__burger').trigger('click')
    expect(wrapper.find('#main-menu').exists()).toBe(true)
    await wrapper.find('.nav__burger').trigger('click')
    expect(wrapper.find('#main-menu').exists()).toBe(false)
  })

  it('toggles and persists the page theme', async () => {
    const wrapper = mount(Navbar, {
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } },
    })

    await wrapper.find('.nav__burger').trigger('click')
    expect(wrapper.find('.menu__theme').text()).toBe('')
    expect(wrapper.find('.menu__theme-icon').exists()).toBe(true)
    await wrapper.find('.menu__theme').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(window.localStorage.getItem('skypro-theme')).toBe('light')

    await wrapper.find('.menu__theme').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
