import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrack: null,
    selectionVersion: 0,
    audioSource: '',
    isPlaying: false,
    isLoadingSource: false,
    currentTime: 0,
    duration: 0,
    volume: 0.5,
    error: '',
  }),

  actions: {
    selectTrack(track) {
      if (
        this.currentTrack?.id === track.id &&
        (this.isLoadingSource || (this.audioSource && !this.error))
      ) {
        return
      }

      this.currentTrack = track
      this.selectionVersion += 1
      this.audioSource = ''
      this.isPlaying = false
      this.isLoadingSource = true
      this.currentTime = 0
      this.duration = 0
      this.error = ''
    },
  },
})
