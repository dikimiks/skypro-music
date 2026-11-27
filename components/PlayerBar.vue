<template>
  <div v-show="player.currentTrack" class="bar">
    <div class="bar__content">
      <p v-if="player.error" class="bar__status" role="alert">{{ player.error }}</p>
      <p v-else-if="favorites.error" class="bar__status" role="alert">{{ favorites.error }}</p>
      <p v-else-if="player.isLoadingSource" class="bar__status" role="status">Загрузка аудио…</p>
      <div
        class="bar__player-progress"
        role="slider"
        aria-label="Позиция воспроизведения"
        :aria-valuemin="0"
        :aria-valuemax="player.duration"
        :aria-valuenow="player.currentTime"
        tabindex="0"
        @click="seekTo"
        @keydown.left.prevent="seekBy(-5)"
        @keydown.right.prevent="seekBy(5)"
      >
        <div
          class="bar__player-progress-fill"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>
      <div class="bar__player-block">
        <div class="bar__player player">
          <div class="player__controls">
            <button type="button" class="player__btn-prev" aria-label="Предыдущий трек" @click="player.previousTrack()">
              <svg class="player__btn-prev-svg">
                <use href="/img/icon/sprite.svg#icon-prev"></use>
              </svg>
            </button>
            <button
              type="button"
              class="player__btn-play _btn"
              :aria-label="player.isPlaying ? 'Пауза' : 'Воспроизвести'"
              @click="togglePlayback"
            >
              <svg class="player__btn-play-svg">
                <use v-if="!player.isPlaying" href="/img/icon/sprite.svg#icon-play"></use>
                <g v-else>
                  <rect x="2" y="1" width="6" height="18" />
                  <rect x="14" y="1" width="6" height="18" />
                </g>
              </svg>
            </button>
            <button type="button" class="player__btn-next" aria-label="Следующий трек" @click="player.nextTrack()">
              <svg class="player__btn-next-svg">
                <use href="/img/icon/sprite.svg#icon-next"></use>
              </svg>
            </button>
            <button type="button" class="player__btn-repeat _btn-icon" :class="{ active: player.isLooping }" aria-label="Повтор трека" @click="toggleLoop">
              <svg class="player__btn-repeat-svg">
                <use href="/img/icon/sprite.svg#icon-repeat"></use>
              </svg>
            </button>
            <button type="button" class="player__btn-shuffle _btn-icon" :class="{ active: player.isShuffled }" aria-label="Перемешать треки" @click="toggleShuffle">
              <svg class="player__btn-shuffle-svg">
                <use href="/img/icon/sprite.svg#icon-shuffle"></use>
              </svg>
            </button>
          </div>

          <div class="player__track-play track-play">
            <div class="track-play__contain">
              <div class="track-play__image">
                <svg class="track-play__svg">
                  <use href="/img/icon/sprite.svg#icon-note"></use>
                </svg>
              </div>
              <div class="track-play__author">
                <a class="track-play__author-link" href="#">{{ player.currentTrack?.name || player.currentTrack?.title || 'Выберите трек' }}</a>
              </div>
              <div class="track-play__album">
                <a class="track-play__album-link" href="#">{{ player.currentTrack?.author || player.currentTrack?.album || '' }}</a>
              </div>
            </div>
            <div class="track-play__like-dis">
              <button
                type="button"
                class="track-play__like _btn-icon"
                :class="{ active: isCurrentFavorite }"
                :aria-label="isCurrentFavorite ? 'Убрать из избранного' : 'Добавить в избранное'"
                :aria-pressed="isCurrentFavorite"
                :disabled="favoritePending"
                @click="setCurrentFavorite(!isCurrentFavorite)"
              >
                <svg class="track-play__like-svg">
                  <use href="/img/icon/sprite.svg#icon-like"></use>
                </svg>
              </button>
              <button
                type="button"
                class="track-play__dislike _btn-icon"
                aria-label="Убрать из избранного"
                :disabled="favoritePending || !isCurrentFavorite"
                @click="setCurrentFavorite(false)"
              >
                <svg class="track-play__dislike-svg">
                  <use href="/img/icon/sprite.svg#icon-dislike"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="bar__volume-block volume">
          <div class="volume__content">
            <button
              type="button"
              class="volume__mute"
              :class="{ active: player.muted }"
              :aria-label="player.muted ? 'Включить звук' : 'Отключить звук'"
              :aria-pressed="player.muted"
              @click="toggleMute"
            >
              <svg class="volume__svg">
                <use href="/img/icon/sprite.svg#icon-volume"></use>
              </svg>
            </button>
            <div class="volume__progress _btn">
              <input
                class="volume__progress-line _btn"
                type="range"
                name="range"
                aria-label="Громкость"
                min="0"
                max="1"
                step="0.01"
                :value="player.volume"
                @input="setVolume($event.target.value)"
              />
            </div>
          </div>
        </div>
      </div>
      <audio
        ref="audioRef"
        class="bar__audio"
        :src="player.audioSource || undefined"
        preload="metadata"
        :loop="player.isLooping"
        @loadedmetadata="onLoadedMetadata"
        @durationchange="onLoadedMetadata"
        @timeupdate="onTimeUpdate"
        @playing="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @error="onAudioError"
      ></audio>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '~/store/player'
import { useFavoritesStore } from '~/store/favorites'

const player = usePlayerStore()
const favorites = useFavoritesStore()
const favoritePending = ref(false)
const isCurrentFavorite = computed(() =>
  player.currentTrack ? favorites.isFavorite(player.currentTrack) : false,
)
const {
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
} = useAudioPlayer()

function seekBy(seconds) {
  const audio = audioRef.value

  if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
    return
  }

  audio.currentTime = Math.min(audio.duration, Math.max(0, audio.currentTime + seconds))
  player.currentTime = audio.currentTime
}

function toggleShuffle() {
  player.toggleShuffle()
}

function toggleLoop() {
  player.toggleLoop()
  if (audioRef.value) {
    audioRef.value.loop = player.isLooping
  }
}

async function setCurrentFavorite(shouldBeFavorite) {
  if (!player.currentTrack || shouldBeFavorite === isCurrentFavorite.value || favoritePending.value) {
    return
  }

  favoritePending.value = true
  try {
    await favorites.toggle(player.currentTrack)
  } finally {
    favoritePending.value = false
  }
}
</script>

<style scoped>
.bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  width: 100%;
  max-width: 1920px;
  transform: translateX(-50%);
  z-index: 10;
  background: var(--bg-player-overlay);
}

.bar__content {
  display: flex;
  flex-direction: column;
}

.bar__status {
  position: absolute;
  right: 24px;
  bottom: 82px;
  margin: 0;
  color: var(--text-primary);
  font-size: 13px;
}

.bar__audio {
  display: none;
}

.bar__player-progress {
  position: relative;
  width: 100%;
  height: 5px;
  background: var(--bg-progress);
  cursor: pointer;
}

.bar__player-progress-fill {
  height: 100%;
  background: #b672ff;
  pointer-events: none;
}

.bar__player-block {
  height: 73px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.bar__player {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.bar__volume-block {
  width: auto;
  display: flex;
  align-items: center;
  padding: 0 92px 0 0;
}

.player__controls {
  display: flex;
  flex-direction: row;
  padding: 0 27px 0 31px;
}

.player__btn-prev,
.player__btn-play,
.player__btn-next,
.player__btn-repeat,
.player__btn-shuffle {
  padding: 5px;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.player__btn-prev {
  margin-right: 23px;
}

.player__btn-prev-svg {
  width: 15px;
  height: 14px;
}

.player__btn-play {
  margin-right: 23px;
}

.player__btn-play-svg {
  width: 22px;
  height: 20px;
  fill: #d9d9d9;
}

.player__btn-next {
  margin-right: 28px;
  fill: #a53939;
}

.player__btn-next-svg {
  width: 15px;
  height: 14px;
  fill: inherit;
  stroke: #d9d9d9;
}

.player__btn-repeat {
  margin-right: 24px;
}

.player__btn-repeat-svg {
  width: 18px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
}

.player__btn-shuffle {
  display: flex;
  align-items: center;
}

.player__btn-shuffle-svg {
  width: 19px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
}

.track-play {
  display: flex;
  flex-direction: row;
}

.track-play__contain {
  width: auto;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: "image author" "image album";
  align-items: center;
}

.track-play__image {
  width: 51px;
  height: 51px;
  background-color: var(--bg-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  grid-area: image;
}

.track-play__svg {
  width: 18px;
  height: 17px;
  fill: transparent;
  color: var(--text-muted);
  stroke: currentColor;
}

.track-play__author {
  grid-area: author;
  min-width: 49px;
}

.track-play__author-link {
  font-size: 16px;
  line-height: 18px;
  color: var(--text-primary);
  white-space: nowrap;
  text-decoration: none;
}

.track-play__album {
  grid-area: album;
  min-width: 49px;
}

.track-play__album-link {
  font-size: 13px;
  line-height: 18px;
  color: var(--text-primary);
  text-decoration: none;
}

.track-play__like-dis {
  display: flex;
  align-items: center;
  margin-left: 24px;
}

.track-play__like,
.track-play__dislike {
  border: 0;
  background: transparent;
  padding: 5px;
  cursor: pointer;
}

.track-play__like-svg {
  width: 14px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
}

.track-play__like.active .track-play__like-svg {
  fill: var(--accent);
  stroke: var(--accent);
}

.track-play__dislike {
  margin-left: 14px;
}

.track-play__dislike-svg {
  width: 14.34px;
  height: 13px;
  fill: transparent;
  stroke: #696969;
}

.track-play__like:hover:not(:disabled) .track-play__like-svg,
.track-play__dislike:hover:not(:disabled) .track-play__dislike-svg,
.track-play__like:focus-visible .track-play__like-svg,
.track-play__dislike:focus-visible .track-play__dislike-svg {
  stroke: var(--accent-light);
}

.track-play__like:disabled,
.track-play__dislike:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.track-play__like:disabled {
  cursor: pointer;
}

.volume__content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
}

.volume__mute {
  width: 30px;
  height: 30px;
  margin-right: 8px;
  padding: 6px;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}

.volume__mute.active .volume__svg {
  stroke: var(--accent);
  opacity: 0.7;
}

.volume__svg {
  width: 13px;
  height: 18px;
  fill: transparent;
}

.volume__progress {
  width: 109px;
}

.volume__progress-line {
  width: 109px;
}

._btn,
._btn-icon {
  cursor: pointer;
}

._btn-icon:hover svg {
  fill: transparent;
  stroke: #acacac;
}

._btn-icon:active svg {
  fill: transparent;
  stroke: #ffffff;
}

._btn-icon:active .track-play__dislike-svg {
  fill: #696969;
  stroke: #ffffff;
}

.player__btn-repeat.active svg,
.player__btn-shuffle.active svg {
  stroke: #ad61ff;
}

.bar__player-progress:hover,
.bar__player-progress:focus-visible {
  background: var(--bg-muted);
}

@media (max-width: 1100px) {
  .bar__volume-block {
    padding-right: 32px;
  }

  .player__controls {
    padding-left: 20px;
    padding-right: 20px;
  }
}

@media (max-width: 720px) {
  .bar__player-block {
    height: 64px;
  }

  .bar__volume-block {
    display: none;
  }

  .player__controls {
    padding: 0 12px;
  }

  .player__btn-prev,
  .player__btn-play,
  .player__btn-next {
    margin-right: 10px;
  }

  .player__btn-repeat,
  .player__btn-shuffle {
    display: none;
  }

  .track-play__like-dis {
    display: none;
  }

  .track-play__contain {
    max-width: 180px;
  }

  .track-play__image {
    width: 44px;
    height: 44px;
  }
}
</style>
