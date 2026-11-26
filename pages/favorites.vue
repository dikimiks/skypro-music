<template>
  <section class="main__centerblock centerblock">
    <div class="centerblock__search search">
      <svg class="search__svg" aria-hidden="true">
        <use href="/img/icon/sprite.svg#icon-search"></use>
      </svg>
      <input
        v-model="search"
        class="search__text"
        type="search"
        placeholder="Поиск"
        aria-label="Поиск треков по названию"
      />
    </div>
    <h2 class="centerblock__h2">Мои треки</h2>
    <FilterControls
      v-if="user.isAuthenticated"
      :authors="authors"
      :years="years"
      :genres="genres"
      v-model:author="selectedAuthor"
      v-model:year="selectedYear"
      v-model:genre="selectedGenre"
    />
    <p v-if="!user.isAuthenticated" class="centerblock__status">
      Для просмотра избранного войдите в аккаунт.
    </p>
    <p v-else-if="favorites.pending" class="centerblock__status" role="status">Загрузка…</p>
    <p v-else-if="favorites.error" class="centerblock__status" role="alert">
      {{ favorites.error }}
    </p>
    <p v-else-if="!tracks.length" class="centerblock__status">У вас пока нет избранных треков.</p>
    <p v-else-if="!filteredTracks.length" class="centerblock__status" role="status">
      По вашему запросу ничего не найдено.
    </p>
    <Playlist v-else :tracks="filteredTracks" />
  </section>
</template>

<script setup>
import { useUserStore } from '~/store/user'
import { usePlayerStore } from '~/store/player'
import { useFavoritesStore } from '~/store/favorites'
import { useFiltersStore } from '~/store/filters'
import {
  filterTracks,
  getTrackAuthors,
  getTrackGenres,
  getTrackYears,
} from '~/utils/music'

const user = useUserStore()
const player = usePlayerStore()
const favorites = useFavoritesStore()
const filters = useFiltersStore()

useHead({
  title: 'Мои треки | Музыкальный сервис',
  meta: [{ name: 'description', content: 'Избранные треки пользователя' }],
})

onMounted(async () => {
  user.restore()
  await favorites.load()
})

watch(() => user.accessToken, () => favorites.load())

const tracks = computed(() => favorites.tracks)
const authors = computed(() => getTrackAuthors(tracks.value))
const years = computed(() => getTrackYears(tracks.value))
const genres = computed(() => getTrackGenres(tracks.value))
const filteredTracks = computed(() => filterTracks(tracks.value, filters.$state))
const search = computed({
  get: () => filters.search,
  set: (value) => filters.setSearch(value),
})
const selectedAuthor = computed({
  get: () => filters.author,
  set: (value) => filters.setAuthor(value),
})
const selectedYear = computed({
  get: () => filters.year,
  set: (value) => filters.setYear(value),
})
const selectedGenre = computed({
  get: () => filters.genre,
  set: (value) => filters.setGenre(value),
})

watchEffect(() => {
  if (!favorites.pending && !favorites.error) {
    player.setQueue(filteredTracks.value)
  }
})
</script>
