import { defineStore } from 'pinia'
import { API_BASE, getTrackId } from '~/utils/music'
import { useUserStore } from '~/store/user'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    ids: [],
    tracks: [],
    pending: false,
    error: '',
  }),
  getters: {
    isFavorite: (state) => (track) => state.ids.includes(getTrackId(track)),
  },
  actions: {
    clear() {
      this.ids = []
      this.tracks = []
      this.pending = false
      this.error = ''
    },
    async load() {
      const user = useUserStore()
      if (!user.isAuthenticated) {
        this.clear()
        return
      }
      if (this.pending) return

      this.pending = true
      this.error = ''

      try {
        let response
        try {
          response = await $fetch(`${API_BASE}/catalog/track/favorite/all/`, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          })
        } catch (requestError) {
          if (requestError?.statusCode !== 401 || !await user.refreshSession()) {
            throw requestError
          }
          response = await $fetch(`${API_BASE}/catalog/track/favorite/all/`, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          })
        }

        if (!response?.success || !Array.isArray(response.data)) {
          throw new Error('Не удалось загрузить избранные треки.')
        }

        this.tracks = response.data
        this.ids = response.data.map((track) => getTrackId(track)).filter(Boolean)
      } catch (requestError) {
        this.error = requestError?.data?.detail
          || requestError?.data?.message
          || 'Не удалось загрузить избранные треки.'
      } finally {
        this.pending = false
      }
    },
    async toggle(track) {
      const user = useUserStore()
      if (!user.isAuthenticated) {
        await navigateTo('/login')
        return false
      }

      const trackId = getTrackId(track)
      if (!trackId) return false

      const removing = this.ids.includes(trackId)
      const previousIds = [...this.ids]
      const previousTracks = [...this.tracks]

      this.ids = removing
        ? this.ids.filter((id) => id !== trackId)
        : [...this.ids, trackId]
      if (removing) {
        this.tracks = this.tracks.filter((item) => getTrackId(item) !== trackId)
      } else if (!this.tracks.some((item) => getTrackId(item) === trackId)) {
        this.tracks = [...this.tracks, track]
      }

      const endpoint = `${API_BASE}/catalog/track/${trackId}/favorite/`
      try {
        const request = () => $fetch(endpoint, {
          method: removing ? 'DELETE' : 'POST',
          headers: { Authorization: `Bearer ${user.accessToken}` },
        })

        try {
          await request()
        } catch (requestError) {
          if (requestError?.statusCode !== 401 || !await user.refreshSession()) {
            throw requestError
          }
          await request()
        }
        this.error = ''
        return true
      } catch (requestError) {
        this.ids = previousIds
        this.tracks = previousTracks
        this.error = requestError?.data?.detail
          || requestError?.data?.message
          || 'Не удалось изменить избранное.'
        return false
      }
    },
  },
})
