<template>
  <section class="main__centerblock centerblock">
          <div class="centerblock__search search">
            <svg class="search__svg">
              <use href="/img/icon/sprite.svg#icon-search"></use>
            </svg>
            <input
              v-model="search"
              class="search__text"
              type="search"
              placeholder="Поиск"
              name="search"
            />
          </div>

          <h2 class="centerblock__h2">Треки</h2>

          <FilterControls
            :authors="authors"
            :years="years"
            :genres="genres"
            v-model:author="selectedAuthor"
            v-model:year="selectedYear"
            v-model:genre="selectedGenre"
          />
          <p v-if="pending" class="centerblock__status" role="status">Загрузка…</p>
          <p v-else-if="requestFailed" class="centerblock__status" role="alert">
            Не удалось загрузить треки. Попробуйте обновить страницу.
          </p>
          <p v-else-if="!filteredTracks.length" class="centerblock__status" role="status">
            По вашему запросу ничего не найдено.
          </p>
          <Playlist v-else :tracks="filteredTracks" />
  </section>
</template>

<script setup>
import { useFiltersStore } from '~/store/filters'
import { usePlayerStore } from '~/store/player'
import {
  filterTracks,
  getTrackAuthors,
  getTrackGenres,
  getTrackYears,
} from '~/utils/music'

useHead({
  title: 'Музыкальный сервис',
  meta: [{ name: 'description', content: 'Главная подборка музыкальных треков' }],
})

const { data: response, pending, error } = await useFetch(
  'https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/',
)
const filters = useFiltersStore()
const player = usePlayerStore()

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
const search = computed({
  get: () => filters.search,
  set: (value) => filters.setSearch(value),
})

const tracks = computed(() => {
  const data = response.value?.data
  return Array.isArray(data) ? data : []
})

const requestFailed = computed(
  () =>
    Boolean(error.value) ||
    response.value?.success !== true ||
    !Array.isArray(response.value?.data),
)

const authors = computed(() => getTrackAuthors(tracks.value))
const years = computed(() => getTrackYears(tracks.value))
const genres = computed(() => getTrackGenres(tracks.value))
const filteredTracks = computed(() =>
  filterTracks(tracks.value, {
    author: filters.author,
    year: filters.year,
    genre: filters.genre,
    search: filters.search,
  }),
)

watchEffect(() => {
  if (!pending.value && !requestFailed.value) {
    player.setQueue(filteredTracks.value)
  }
})
</script>

<style scoped>
.wrapper {
  width: 100%;
  min-height: 100vh;
  overflow-x: clip;
  background-color: var(--bg-shell);
  color: var(--text-primary);
  font-family: "Montserrat", sans-serif;
}

.container {
  max-width: 1920px;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  padding-bottom: 78px;
  background-color: var(--bg-main);
}

.main {
  min-height: calc(100vh - 78px);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.main__centerblock {
  min-width: 0;
  flex: 1 1 auto;
  padding: 20px 40px 0 50px;
}

.main__sidebar {
  max-width: 418px;
  padding: 20px 90px 20px 78px;
}

.centerblock__search {
  width: calc(100% + 118px);
  height: 52px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 50px;
  display: flex;
  align-items: center;
}

.centerblock__status {
  font-size: 16px;
  line-height: 24px;
}

.centerblock__h2 {
  font-weight: 400;
  font-size: 60px;
  line-height: 64px;
  letter-spacing: -0.78px;
  margin: 0 0 53px;
}

.search__svg {
  width: 17px;
  height: 17px;
  margin-right: 5px;
  stroke: var(--text-primary);
  fill: transparent;
  flex-shrink: 0;
}

.search__text {
  flex-grow: 1;
  background-color: transparent;
  border: none;
  outline: none;
  height: 52px;
  padding: 14px 10px 16px;
  font: inherit;
  font-size: 16px;
  line-height: 18px;
  color: var(--text-primary);
}

.search__text::placeholder {
  color: var(--text-primary);
  opacity: 1;
}

.sidebar__personal {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 0 15px;
}

.sidebar__personal-name {
  font-size: 16px;
  line-height: 24px;
  color: var(--text-primary);
  margin-right: 16px;
}

.sidebar__icon {
  width: 43px;
  height: 43px;
  background-color: var(--bg-muted);
  border-radius: 50%;
  cursor: pointer;
}

.sidebar__block {
  height: 100%;
  padding: 240px 0 0;
}

.sidebar__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sidebar__item {
  width: 250px;
  height: 150px;
}

.sidebar__item:not(:last-child) {
  margin-bottom: 30px;
}

.sidebar__link {
  display: block;
  width: 100%;
  height: 100%;
}

.sidebar__img {
  display: block;
  width: 100%;
  height: auto;
}

@media (max-width: 1100px) {
  .main__centerblock {
    padding-right: 28px;
  }

  .centerblock__search {
    width: 100%;
  }
}

@media (max-width: 1440px) and (min-width: 1101px) {
  .centerblock__search {
    width: calc(100% + 72px);
  }
}

@media (max-width: 720px) {
  .main__centerblock {
    padding: 16px 16px 0;
  }

  .centerblock__search {
    margin-bottom: 32px;
  }

  .centerblock__h2 {
    margin-bottom: 28px;
    font-size: 40px;
    line-height: 44px;
  }
}
</style>
