import { usePlayerStore } from '~/store/player'

const TRACK_API_URL = 'https://webdev-music-003b5b991590.herokuapp.com/catalog/track'

export function useAudioPlayer() {
  const player = usePlayerStore()
  const audioRef = ref(null)
  let sourceRequestId = 0

  watch(
    () => player.selectionVersion,
    async () => {
      const trackId = player.currentTrack?.id

      if (trackId === undefined || trackId === null) {
        return
      }

      const requestId = ++sourceRequestId
      const audio = audioRef.value
      audio?.pause()
      player.audioSource = ''
      player.isPlaying = false
      player.isLoadingSource = true
      player.currentTime = 0
      player.duration = 0
      player.error = ''

      try {
        const response = await $fetch(`${TRACK_API_URL}/${trackId}/`)
        const track = response?.data

        if (
          requestId !== sourceRequestId ||
          !response?.success ||
          !track ||
          String(track._id) !== String(trackId) ||
          typeof track.track_file !== 'string' ||
          !track.track_file
        ) {
          if (requestId === sourceRequestId) {
            throw new Error('Track audio is unavailable')
          }

          return
        }

        player.currentTrack = { ...player.currentTrack, ...track }
        player.audioSource = track.track_file
        await nextTick()
        audioRef.value?.load()
      } catch {
        if (requestId === sourceRequestId) {
          player.audioSource = ''
          player.error = 'Не удалось загрузить аудиофайл этого трека.'
        }
      } finally {
        if (requestId === sourceRequestId) {
          player.isLoadingSource = false
        }
      }
    },
    { flush: 'post' },
  )

  watch(
    () => [player.volume, audioRef.value],
    ([volume, audio]) => {
      if (audio) {
        audio.volume = volume
      }
    },
    { immediate: true },
  )

  function onLoadedMetadata() {
    if (audioRef.value) {
      player.duration = Number.isFinite(audioRef.value.duration)
        ? audioRef.value.duration
        : 0
    }
  }

  function onTimeUpdate() {
    if (audioRef.value) {
      player.currentTime = audioRef.value.currentTime
    }
  }

  function onPlay() {
    player.isPlaying = true
    player.error = ''
  }

  function onPause() {
    player.isPlaying = false
  }

  function onAudioError() {
    player.isPlaying = false
    player.error = 'Не удалось воспроизвести аудиофайл этого трека.'
  }

  async function togglePlayback() {
    const audio = audioRef.value

    if (!player.audioSource || !audio) {
      player.error = player.isLoadingSource
        ? 'Аудиофайл загружается.'
        : 'Выберите трек из списка.'
      return
    }

    if (audio.paused) {
      try {
        await audio.play()
      } catch {
        player.isPlaying = false
        player.error = 'Не удалось начать воспроизведение.'
      }
    } else {
      audio.pause()
    }
  }

  function setVolume(value) {
    const volume = Number(value)

    if (Number.isFinite(volume)) {
      player.volume = Math.min(1, Math.max(0, volume))
    }
  }

  function seekTo(event) {
    const audio = audioRef.value

    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const position = (event.clientX - bounds.left) / bounds.width
    const time = Math.min(1, Math.max(0, position)) * audio.duration

    audio.currentTime = time
    player.currentTime = time
  }

  const progressPercent = computed(() =>
    player.duration > 0
      ? Math.min(100, (player.currentTime / player.duration) * 100)
      : 0,
  )

  return {
    audioRef,
    onLoadedMetadata,
    onTimeUpdate,
    onPlay,
    onPause,
    onAudioError,
    togglePlayback,
    setVolume,
    seekTo,
    progressPercent,
  }
}
