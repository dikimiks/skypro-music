export const API_BASE = 'https://webdev-music-003b5b991590.herokuapp.com'

export function getTrackId(track) {
  const id = track?._id ?? track?.id
  return id === undefined || id === null ? '' : String(id)
}

export function formatDuration(seconds) {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) {
    return ''
  }
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

export function uniqueSorted(values, descending = false) {
  return [...new Set(values.filter((value) => typeof value === 'string' && value.trim()))]
    .sort((a, b) => descending ? Number(b) - Number(a) : a.localeCompare(b))
}

export function getTrackAuthors(tracks) {
  return uniqueSorted(tracks.map((track) => track.author))
}

export function getTrackYears(tracks) {
  return uniqueSorted(
    tracks
      .map((track) => typeof track.release_date === 'string' && /^\d{4}-/.test(track.release_date)
        ? track.release_date.slice(0, 4)
        : ''),
    true,
  )
}

export function getTrackGenres(tracks) {
  return uniqueSorted(tracks.flatMap((track) =>
    Array.isArray(track.genre) ? track.genre : [],
  ))
}

export function filterTracks(tracks, filters) {
  const search = typeof filters.search === 'string'
    ? filters.search.trim().toLocaleLowerCase()
    : ''
  const authors = normalizeFilterValues(filters.author)
  const years = normalizeFilterValues(filters.year)
  const genres = normalizeFilterValues(filters.genre)

  return tracks.filter((track) =>
    (!authors.length || authors.includes(track.author)) &&
    (!years.length || (typeof track.release_date === 'string' && years.some((year) => track.release_date.startsWith(year)))) &&
    (!genres.length || (Array.isArray(track.genre) && track.genre.some((genre) => genres.includes(genre)))) &&
    (!search || String(track.name || '').toLocaleLowerCase().includes(search)),
  )
}

function normalizeFilterValues(value) {
  if (Array.isArray(value)) return value
  return value ? [value] : []
}
