import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterControls from '../components/FilterControls.vue'

describe('FilterControls', () => {
  it('supports selecting and clearing multiple values in one filter', async () => {
    const wrapper = mount(FilterControls, {
      props: {
        authors: ['A', 'B'],
        years: ['2024'],
        genres: ['Rock'],
        author: ['A'],
      },
    })

    await wrapper.find('.button-author').trigger('click')
    const options = wrapper.findAll('.filter__option')
    await options[1].trigger('click')
    expect(wrapper.emitted('update:author')[0]).toEqual([['A', 'B']])
    expect(wrapper.find('.filter__options').exists()).toBe(true)

    await wrapper.setProps({ author: ['A', 'B'] })
    expect(wrapper.find('.filter__count').text()).toBe('2')
    expect(wrapper.findAll('.filter__option')[0].attributes('aria-selected')).toBe('true')

    await wrapper.findAll('.filter__option')[0].trigger('click')
    expect(wrapper.emitted('update:author')[1]).toEqual([['B']])
  })
})
