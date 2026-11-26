<template>
  <div class="centerblock__filter filter">
    <div class="filter__title">Искать по:</div>
    <div v-for="filter in filters" :key="filter.key" class="filter__group">
      <button
        type="button"
        :class="['filter__button', filter.className, '_btn-text', { 'filter__button_active': filter.value.length }]"
        :aria-expanded="openFilter === filter.key"
        :aria-controls="`filter-options-${filter.key}`"
        @click="toggleFilter(filter.key)"
      >
        {{ filter.value.length === 1 ? filter.value[0] : filter.label }}
        <span
          v-if="filter.value.length"
          class="filter__count"
          :aria-label="selectionLabel(filter.value.length)"
        >
          {{ filter.value.length }}
        </span>
      </button>
      <ul
        v-if="openFilter === filter.key"
        :id="`filter-options-${filter.key}`"
        class="filter__options scrollbar-hidden"
        role="listbox"
        aria-multiselectable="true"
        :aria-label="`Фильтр по ${filter.label}`"
      >
        <li v-for="option in filter.options" :key="option">
          <button
            type="button"
            class="filter__option"
            role="option"
            :aria-selected="filter.value.includes(option)"
            @click="toggleOption(filter, option)"
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
    type: [Array, String],
    default: () => [],
  },
  year: {
    type: [Array, String],
    default: () => [],
  },
  genre: {
    type: [Array, String],
    default: () => [],
  },
})

const emit = defineEmits(['update:author', 'update:year', 'update:genre'])
const openFilter = ref('')

const filters = computed(() => [
  {
    key: 'author',
    label: 'исполнителю',
    options: props.authors,
    value: normalizeSelection(props.author),
    className: 'button-author',
  },
  {
    key: 'year',
    label: 'году выпуска',
    options: props.years,
    value: normalizeSelection(props.year),
    className: 'button-year',
  },
  {
    key: 'genre',
    label: 'жанру',
    options: props.genres,
    value: normalizeSelection(props.genre),
    className: 'button-genre',
  },
])

function toggleFilter(key) {
  openFilter.value = openFilter.value === key ? '' : key
}

function normalizeSelection(value) {
  if (Array.isArray(value)) return value
  return value ? [value] : []
}

function toggleOption(filter, option) {
  const nextValue = filter.value.includes(option)
    ? filter.value.filter((selected) => selected !== option)
    : [...filter.value, option]
  emit(`update:${filter.key}`, nextValue)
}

function selectionLabel(count) {
  return `Выбрано ${count} ${count === 1 ? 'значение' : 'значения'}`
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
  height: 39px;
  border: 1px solid var(--text-primary);
  border-radius: 60px;
  padding: 6px 20px;
  background: transparent;
  color: var(--text-primary);
  font-family: inherit;
  white-space: nowrap;
  cursor: pointer;
}

.filter__count {
  display: inline-flex;
  min-width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  padding: 0 4px;
  border-radius: 50%;
  background: var(--accent);
  color: #ffffff;
  font-size: 11px;
  line-height: 18px;
}

.button-author,
.button-year {
  min-width: 144px;
}

.button-genre {
  min-width: 91px;
}

.filter__button_active {
  border-color: var(--accent);
  color: var(--accent-light);
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
  background-color: var(--bg-menu);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.filter__option {
  display: block;
  width: 100%;
  padding: 6px 12px;
  border: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.filter__option:hover,
.filter__option[aria-selected="true"] {
  color: var(--accent-light);
}

._btn-text:hover {
  border-color: var(--accent-light);
  color: var(--accent-light);
}

._btn-text:active {
  border-color: var(--accent);
  color: var(--accent);
}

@media (max-width: 720px) {
  .centerblock__filter {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 36px;
  }

  .filter__title {
    width: 100%;
  }

  .filter__group:not(:last-child) {
    margin-right: 0;
  }

  .filter__button {
    height: 36px;
    padding: 5px 14px;
  }

  .button-author,
  .button-year,
  .button-genre {
    width: auto;
  }
}
</style>
