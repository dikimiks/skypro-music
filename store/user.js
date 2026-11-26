import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    accessToken: '',
    refreshToken: '',
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken),
  },
  actions: {
    restore() {
      if (!import.meta.client) return

      try {
        const stored = JSON.parse(localStorage.getItem('skypro-user') || 'null')
        if (stored && typeof stored === 'object') {
          this.user = stored.user || null
          this.accessToken = stored.accessToken || ''
          this.refreshToken = stored.refreshToken || ''
        }
      } catch {
        this.clear()
      }
    },
    setSession({ user, accessToken, refreshToken }) {
      this.user = user || null
      this.accessToken = accessToken || ''
      this.refreshToken = refreshToken || ''
      this.persist()
    },
    persist() {
      if (!import.meta.client) return
      localStorage.setItem('skypro-user', JSON.stringify({
        user: this.user,
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
      }))
    },
    async refreshSession() {
      if (!this.refreshToken) {
        this.clear()
        return false
      }

      try {
        const response = await $fetch(
          'https://webdev-music-003b5b991590.herokuapp.com/user/token/refresh/',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { refresh: this.refreshToken },
          },
        )
        this.accessToken = response?.access ?? response?.access_token ?? ''
        if (!this.accessToken) {
          this.clear()
          return false
        }
        this.persist()
        return true
      } catch {
        this.clear()
        return false
      }
    },
    clear() {
      this.user = null
      this.accessToken = ''
      this.refreshToken = ''
      if (import.meta.client) {
        localStorage.removeItem('skypro-user')
      }
    },
  },
})
