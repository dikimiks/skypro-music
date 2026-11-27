import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Track from '../components/Track.vue'
import { usePlayerStore } from '../store/player'
import { useFavoritesStore } from '../store/favorites'
import { useUserStore } from '../store/user'

describe('Track', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => vi.unstubAllGlobals())

  it('formats duration and selects track', async () => {
    const track = {
      _id: 7,
      name: 'Song',
      author: 'Artist',
      album: 'Album',
      duration_in_seconds: 125,
      track_file: 'https://example.test/song.mp3',
    }
    const wrapper = mount(Track, { props: { track } })

    expect(wrapper.text()).toContain('2:05')
    expect(wrapper.find('.track__time use').attributes('href')).toContain('#icon-like')
    expect(wrapper.find('.track__time').attributes('aria-pressed')).toBe('false')
    await wrapper.find('.track__title-link').trigger('click')
    expect(wrapper.text()).toContain('Song')
    expect(usePlayerStore().currentTrack?._id).toBe(7)
  })

  it('shows a centered dot instead of a note for the current track', async () => {
    const player = usePlayerStore()
    const track = { _id: 7, name: 'Song', duration_in_seconds: 60 }
    player.currentTrack = track
    player.isPlaying = true
    const wrapper = mount(Track, { props: { track } })

    expect(wrapper.find('.track__title-image .playing-dot').exists()).toBe(true)
    expect(wrapper.find('.track__title-image .track__title-svg').exists()).toBe(false)
    expect(wrapper.find('.playing-dot.is-paused').exists()).toBe(false)
    player.isPlaying = false
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.playing-dot').exists()).toBe(true)
    expect(wrapper.find('.playing-dot.is-paused').exists()).toBe(true)
  })

  it('plays the selected track from both the indicator and title', async () => {
    const player = usePlayerStore()
    const track = { _id: 7, name: 'Song', duration_in_seconds: 60 }
    const wrapper = mount(Track, { props: { track } })

    await wrapper.find('.track__title-image').trigger('click')
    expect(player.currentTrack?._id).toBe(7)
    player.isLoadingSource = false
    player.audioSource = track.track_file || 'song.mp3'
    await wrapper.find('.track__title-link').trigger('click')
    expect(player.playRequestVersion).toBe(1)
  })

  it('shows a note for tracks other than the current track', () => {
    const player = usePlayerStore()
    player.currentTrack = { _id: 7 }
    const wrapper = mount(Track, { props: { track: { _id: 8, name: 'Other' } } })

    expect(wrapper.find('.track__title-image .track__title-svg use').attributes('href'))
      .toContain('#icon-note')
    expect(wrapper.find('.playing-dot').exists()).toBe(false)
  })

  it('reflects the shared favorite state on the track heart', () => {
    const track = { _id: 7, name: 'Song', duration_in_seconds: 60 }
    useFavoritesStore().ids = ['7']
    const wrapper = mount(Track, { props: { track } })

    expect(wrapper.find('.track__time').attributes('aria-pressed')).toBe('true')
  })

  it('updates the shared favorite state immediately from the list heart', async () => {
    const track = { _id: 7, name: 'Song', duration_in_seconds: 60 }
    const favorites = useFavoritesStore()
    useUserStore().accessToken = 'test-token'
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({}))
    const wrapper = mount(Track, { props: { track } })
    const heart = wrapper.find('.track__time')

    await heart.trigger('click')
    expect(heart.attributes('aria-pressed')).toBe('true')
    expect(favorites.ids).toEqual(['7'])
    await flushPromises()

    await heart.trigger('click')
    expect(heart.attributes('aria-pressed')).toBe('false')
    expect(favorites.ids).toEqual([])
  })
})
