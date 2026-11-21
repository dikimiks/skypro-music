<template>
  <div class="centerblock__filter filter">
    <div class="filter__title">Искать по:</div>
    <div v-for="filter in filters" :key="filter.key" class="filter__group">
      <button
        type="button"
        :class="['filter__button', filter.className, '_btn-text', { 'filter__button_active': filter.value }]"
        :aria-expanded="openFilter === filter.key"
        :aria-controls="`filter-options-${filter.key}`"
        @click="toggleFilter(filter.key)"
      >
        {{ filter.value || filter.label }}
      </button>
      <ul
        v-if="openFilter === filter.key"
        :id="`filter-options-${filter.key}`"
        class="filter__options"
        role="listbox"
        :aria-label="`Фильтр по ${filter.label}`"
      >
        <li v-for="option in filter.options" :key="option">
          <button
            type="button"
            class="filter__option"
            role="option"
            :aria-selected="filter.value === option"
            @click="selectOption(filter, option)"
          >
            {{ option }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  authors: {
    type: Array,
    default: () => [],
  },
  years: {
    type: Array,
    default: () => [],
  },
  genres: {
    type: Array,
    default: () => [],
  },
  author: {
    type: String,
    default: '',
  },
  year: {
    type: String,
    default: '',
  },
  genre: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:author', 'update:year', 'update:genre'])
const openFilter = ref('')

const filters = computed(() => [
  {
    key: 'author',
    label: 'исполнителю',
    options: props.authors,
    value: props.author,
    className: 'button-author',
  },
  {
    key: 'year',
    label: 'году выпуска',
    options: props.years,
    value: props.year,
    className: 'button-year',
  },
  {
    key: 'genre',
    label: 'жанру',
    options: props.genres,
    value: props.genre,
    className: 'button-genre',
  },
])

function toggleFilter(key) {
  openFilter.value = openFilter.value === key ? '' : key
}

function selectOption(filter, option) {
  emit(`update:${filter.key}`, filter.value === option ? '' : option)
  openFilter.value = ''
}
</script>

<style scoped>
.centerblock__filter {
  display: flex;
  align-items: center;
  margin-bottom: 51px;
}

.filter__title {
  font-size: 16px;
  line-height: 24px;
  margin-right: 15px;
}

.filter__group {
  position: relative;
}

.filter__group:not(:last-child) {
  margin-right: 10px;
}

.filter__button {
  font-size: 16px;
  line-height: 24px;
  border: 1px solid #ffffff;
  border-radius: 60px;
  padding: 6px 20px;
  font-family: inherit;
  cursor: pointer;
}

.filter__button_active {
  border-color: #ad61ff;
  color: #d9b6ff;
}

.filter__options {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 2;
  min-width: 100%;
  max-width: 280px;
  max-height: 220px;
  overflow-y: auto;
  margin: 0;
  padding: 8px;
  list-style: none;
  background-color: #2e2e2e;
  border: 1px solid #4e4e4e;
  border-radius: 12px;
}

.filter__option {
  display: block;
  width: 100%;
  padding: 6px 12px;
  border: 0;
  background: transparent;
  color: #ffffff;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.filter__option:hover,
.filter__option[aria-selected="true"] {
  color: #d9b6ff;
}

._btn-text:hover {
  border-color: #d9b6ff;
  color: #d9b6ff;
}

._btn-text:active {
  border-color: #ad61ff;
  color: #ad61ff;
}
</style>
