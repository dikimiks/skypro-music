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
    <h2 class="centerblock__h2">{{ categoryTitle }}</h2>
    <FilterControls
      :authors="authors"
      :years="years"
      :genres="genres"
      v-model:author="selectedAuthor"
      v-model:year="selectedYear"
      v-model:genre="selectedGenre"
    />
    <p v-if="pending" class="centerblock__status" role="status">Загрузка…</p>
    <p v-else-if="error" class="centerblock__status" role="alert">
      Не удалось загрузить треки. Попробуйте обновить страницу.
    </p>
    <p v-else-if="!categoryTracks.length" class="centerblock__status">
      В этой подборке пока нет треков.
    </p>
    <p v-else-if="!visibleTracks.length" class="centerblock__status" role="status">
      По вашему запросу ничего не найдено.
    </p>
    <Playlist v-else :tracks="visibleTracks" />
  </section>
</template>

<script setup>
import { useFiltersStore } from '~/store/filters'
import { usePlayerStore } from '~/store/player'
import {
  API_BASE,
  filterTracks,
  getTrackAuthors,
  getTrackGenres,
  getTrackYears,
} from '~/utils/music'

const route = useRoute()
const categoryName = computed(() => decodeURIComponent(String(route.params.id)))
const categoryTitle = computed(() => ({
  'Рок музыка': 'Плейлист дня',
  'Электронная музыка': '100 танцевальных хитов',
  'Классическая музыка': 'Инди-заряд',
}[categoryName.value] || categoryName.value))
const player = usePlayerStore()
const filters = useFiltersStore()
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

useHead({
  title: () => `${categoryTitle.value} | Музыкальный сервис`,
  meta: [{ name: 'description', content: () => `Плейлист ${categoryTitle.value}` }],
})

const { data: response, pending, error } = await useFetch(`${API_BASE}/catalog/track/all/`)
const tracks = computed(() =>
  response.value?.success && Array.isArray(response.value.data)
    ? response.value.data
    : [],
)
const categoryTracks = computed(() =>
  tracks.value.filter((track) =>
    Array.isArray(track.genre) &&
    track.genre.some((genre) =>
      String(genre).toLocaleLowerCase() === categoryName.value.toLocaleLowerCase(),
    ),
  ),
)
const authors = computed(() => getTrackAuthors(categoryTracks.value))
const years = computed(() => getTrackYears(categoryTracks.value))
const genres = computed(() => getTrackGenres(categoryTracks.value))
const visibleTracks = computed(() =>
  filterTracks(categoryTracks.value, filters.$state),
)

watchEffect(() => {
  if (!pending.value && !error.value) {
    player.setQueue(visibleTracks.value)
  }
})
</script>
