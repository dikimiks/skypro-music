import { usePlayerStore } from '~/store/player'

export function useAudioPlayer() {
  const player = usePlayerStore()
  const audioRef = ref(null)

  watch(
    () => player.selectionVersion,
    async () => {
      const audio = audioRef.value
      audio?.pause()
      audio?.removeAttribute('src')
      audio?.load()
      player.audioSource = ''
      player.isPlaying = false
      player.isLoadingSource = true
      player.currentTime = 0
      player.duration = 0
      player.error = ''
      const source = player.currentTrack?.track_file

      if (typeof source !== 'string' || !source) {
        player.isLoadingSource = false
        player.error = 'Не удалось загрузить аудиофайл этого трека.'
        return
      }

      player.audioSource = source
      await nextTick()
      audioRef.value?.load()
    },
    { flush: 'post' },
  )

  watch(
    () => [player.volume, player.muted, audioRef.value],
    ([volume, muted, audio]) => {
      if (audio) {
        audio.volume = volume
        audio.muted = muted
      }
    },
    { immediate: true },
  )

  function onLoadedMetadata() {
    if (audioRef.value) {
      player.duration = Number.isFinite(audioRef.value.duration)
        ? audioRef.value.duration
        : 0
      player.isLoadingSource = false
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

  function onEnded() {
    player.isPlaying = false
    if (!player.isLooping) {
      player.nextTrack()
    }
  }

  function onAudioError() {
    player.isPlaying = false
    player.isLoadingSource = false
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
      if (volume > 0) {
        player.muted = false
      }
    }
  }

  function toggleMute() {
    player.toggleMute()
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
    onEnded,
    onAudioError,
    togglePlayback,
    setVolume,
    toggleMute,
    seekTo,
    progressPercent,
  }
}
