<template>
  <div class="playlist__item">
    <div class="playlist__track track">
      <div
        class="track__title"
        :class="{
          'is-current': isCurrentTrack,
          'is-playing': isCurrentTrack && player.isPlaying,
        }"
      >
        <div class="track__title-image">
          <span
            v-if="isCurrentTrack"
            class="track__indicator"
            :class="{ 'is-playing': player.isPlaying }"
            aria-hidden="true"
          ></span>
          <svg class="track__title-svg">
            <use href="/img/icon/sprite.svg#icon-note"></use>
          </svg>
        </div>
        <div class="track__title-text">
          <a class="track__title-link" href="#" @click.prevent="player.selectTrack(track)">
            {{ track.name }}
          </a>
        </div>
      </div>
      <div class="track__author">
        <a class="track__author-link" href="#">{{ track.author }}</a>
      </div>
      <div class="track__album">
        <a class="track__album-link" href="#">{{ track.album }}</a>
      </div>
      <button
        type="button"
        class="track__time"
        :aria-label="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
        :aria-pressed="isFavorite"
        :disabled="favoritePending"
        @click="toggleFavorite"
      >
        <svg class="track__time-svg">
          <use href="/img/icon/sprite.svg#icon-like"></use>
        </svg>
        <span class="track__time-text">{{ formattedDuration }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '~/store/player'
import { useFavoritesStore } from '~/store/favorites'
import { formatDuration } from '~/utils/music'

const player = usePlayerStore()
const favorites = useFavoritesStore()
const favoritePending = ref(false)
const isFavorite = computed(() => favorites.isFavorite(props.track))
const isCurrentTrack = computed(() => {
  const currentId = player.currentTrack?._id ?? player.currentTrack?.id
  const trackId = props.track?._id ?? props.track?.id
  return currentId !== undefined && currentId !== null && String(currentId) === String(trackId)
})

const props = defineProps({
  track: {
    type: Object,
    required: true,
  },
})

const formattedDuration = computed(() => formatDuration(props.track.duration_in_seconds))

async function toggleFavorite() {
  favoritePending.value = true
  try {
    await favorites.toggle(props.track)
  } finally {
    favoritePending.value = false
  }
}
</script>

<style scoped>
.playlist__item {
  width: 100%;
  display: block;
  margin-bottom: 12px;
}

.playlist__track {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.track__title {
  position: relative;
  display: flex;
  align-items: center;
  width: 447px;
  flex-shrink: 0;
}

.track__title-image {
  position: relative;
  width: 51px;
  height: 51px;
  padding: 16px;
  background: var(--bg-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 17px;
  flex-shrink: 0;
}

.track__indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  width: 21px;
  height: 21px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 1px solid #000;
  background: #b672ff;
  box-shadow: 0 0 4px rgba(182, 114, 255, 0.6);
  transform: translate(-50%, -50%);
}

.track__indicator.is-playing {
  animation: track-indicator-pulse 1.2s ease-in-out infinite;
}

@keyframes track-indicator-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    opacity: 0.35;
    transform: translate(-50%, -50%) scale(0.75);
  }
}

.track__title-svg {
  width: 18px;
  height: 17px;
  fill: transparent;
  color: var(--text-muted);
  stroke: currentColor;
}

.track__title.is-current .track__title-svg {
  color: var(--accent);
}

.track__title.is-current .track__title-link {
  color: var(--accent-light);
}

.track__title-link {
  font-size: 16px;
  line-height: 18px;
  color: var(--text-primary);
  text-decoration: none;
}

.track__title-span {
  color: var(--text-muted);
}

.track__author {
  width: 321px;
  display: flex;
  justify-content: flex-start;
  flex-shrink: 0;
}

.track__author-link {
  font-size: 16px;
  line-height: 18px;
  color: var(--text-primary);
  text-decoration: none;
  text-align: left;
}

.track__album {
  width: 245px;
  flex-shrink: 0;
}

.track__album-link {
  font-size: 16px;
  line-height: 18px;
  color: var(--text-muted);
  text-decoration: none;
}

.track__time {
  width: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.track__time-svg {
  display: block;
  width: 16px;
  height: 14px;
  flex: 0 0 16px;
  margin-right: 6px;
  fill: transparent;
  stroke: var(--text-muted);
  stroke-width: 1.5;
}

.track__time[aria-pressed="true"] .track__time-svg {
  fill: var(--accent);
  stroke: var(--accent);
}

.track__time-text {
  font-size: 16px;
  line-height: 18px;
  color: var(--text-muted);
  text-align: right;
}

.track__title-link:hover,
.track__author-link:hover {
  color: var(--accent-light);
}

.track__time:disabled {
  cursor: pointer;
  opacity: 0.55;
}

.track__time:hover:not(:disabled) .track__time-svg,
.track__time:focus-visible .track__time-svg {
  stroke: var(--accent-light);
}

@media (max-width: 1760px) {
  .track__title {
    width: 42%;
  }

  .track__author {
    width: 27%;
  }

  .track__album {
    width: 20%;
  }
}

@media (max-width: 720px) {
  .playlist__track {
    display: grid;
    grid-template-columns: 1fr auto;
    row-gap: 4px;
  }

  .track__title {
    width: auto;
  }

  .track__author,
  .track__album {
    display: none;
  }

  .track__time {
    width: auto;
  }
}
</style>
