import { defineStore } from 'pinia'

export const useFiltersStore = defineStore('filters', {
  state: () => ({
    author: [],
    year: [],
    genre: [],
    search: '',
  }),
  actions: {
    setAuthor(value) {
      this.author = normalizeSelection(value)
    },
    setYear(value) {
      this.year = normalizeSelection(value)
    },
    setGenre(value) {
      this.genre = normalizeSelection(value)
    },
    setSearch(value) {
      this.search = value || ''
    },
    reset() {
      this.author = []
      this.year = []
      this.genre = []
      this.search = ''
    },
  },
})

function normalizeSelection(value) {
  const selections = Array.isArray(value) ? value : [value]
  return [...new Set(selections.filter((selection) => typeof selection === 'string' && selection))]
}
