import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrack: null,
    trackQueue: [],
    originalQueue: [],
    selectionVersion: 0,
    playRequestVersion: 0,
    audioSource: '',
    isPlaying: false,
    isLoadingSource: false,
    currentTime: 0,
    duration: 0,
    volume: 0.5,
    muted: false,
    error: '',
    isShuffled: false,
    isLooping: false,
  }),

  actions: {
    setQueue(tracks) {
      const nextQueue = Array.isArray(tracks) ? tracks : []
      this.originalQueue = nextQueue
      this.trackQueue = this.isShuffled ? this.shuffleQueue(nextQueue) : nextQueue
    },
    shuffleQueue(tracks) {
      const shuffled = [...tracks]
      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
      }
      return shuffled
    },
    selectTrack(track) {
      const trackId = track?._id ?? track?.id
      const currentTrackId = this.currentTrack?._id ?? this.currentTrack?.id

      const isSameTrack =
        trackId !== undefined &&
        trackId !== null &&
        currentTrackId !== undefined &&
        currentTrackId !== null &&
        String(currentTrackId) === String(trackId)

      if (isSameTrack && this.isLoadingSource) {
        return
      }

      if (isSameTrack && this.audioSource && !this.error) {
        this.playRequestVersion += 1
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
    toggleShuffle() {
      this.isShuffled = !this.isShuffled
      this.trackQueue = this.isShuffled
        ? this.shuffleQueue(this.originalQueue)
        : [...this.originalQueue]
    },
    toggleLoop() {
      this.isLooping = !this.isLooping
    },
    toggleMute() {
      this.muted = !this.muted
    },
    nextTrack() {
      if (!this.trackQueue.length) return
      const currentId = this.currentTrack?._id ?? this.currentTrack?.id
      const index = this.trackQueue.findIndex((track) =>
        String(track?._id ?? track?.id) === String(currentId),
      )
      const nextIndex = index < 0
        ? 0
        : (index + 1) % this.trackQueue.length
      this.selectTrack(this.trackQueue[nextIndex])
    },
    previousTrack() {
      if (!this.trackQueue.length) return
      const currentId = this.currentTrack?._id ?? this.currentTrack?.id
      const index = this.trackQueue.findIndex((track) =>
        String(track?._id ?? track?.id) === String(currentId),
      )
      const previousIndex = index < 0
        ? this.trackQueue.length - 1
        : (index - 1 + this.trackQueue.length) % this.trackQueue.length
      this.selectTrack(this.trackQueue[previousIndex])
    },
  },
})
