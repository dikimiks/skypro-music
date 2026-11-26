import { describe, expect, it } from 'vitest'
import {
  filterTracks,
  formatDuration,
  getTrackAuthors,
  getTrackGenres,
  getTrackId,
  getTrackYears,
  uniqueSorted,
} from '../utils/music.js'

const tracks = [
  { _id: 1, author: 'A', genre: ['Rock'], release_date: '2024-01-01', duration_in_seconds: 61 },
  { id: 2, author: 'B', genre: ['Pop', 'Rock'], release_date: '2023-05-01', duration_in_seconds: 0 },
]

describe('pure music helpers', () => {
  it('extracts stable ids and formatted duration', () => {
    expect(getTrackId(tracks[0])).toBe('1')
    expect(getTrackId(tracks[1])).toBe('2')
    expect(getTrackId(null)).toBe('')
    expect(formatDuration(61)).toBe('1:01')
    expect(formatDuration(-1)).toBe('')
    expect(formatDuration('61')).toBe('')
    expect(formatDuration(Infinity)).toBe('')
  })

  it('deduplicates and sorts filter values', () => {
    expect(uniqueSorted(['B', 'A', 'B'])).toEqual(['A', 'B'])
    expect(uniqueSorted(['2023', '2024', '2023'], true)).toEqual(['2024', '2023'])
    expect(uniqueSorted(['A', '', null])).toEqual(['A'])
  })

  it('builds unique author, year and genre lists', () => {
    expect(getTrackAuthors(tracks)).toEqual(['A', 'B'])
    expect(getTrackYears(tracks)).toEqual(['2024', '2023'])
    expect(getTrackGenres(tracks)).toEqual(['Pop', 'Rock'])
    expect(getTrackAuthors([])).toEqual([])
    expect(getTrackYears([
      { release_date: 'bad' },
      { release_date: null },
    ])).toEqual([])
    expect(getTrackGenres([
      { genre: 'Rock' },
      {},
    ])).toEqual([])
  })

  it('filters by author, year and genre', () => {
    expect(filterTracks(tracks, { author: 'A', year: '2024', genre: 'Rock' })).toEqual([tracks[0]])
    expect(filterTracks(tracks, { author: '', year: '', genre: 'Rock' })).toEqual(tracks)
    expect(filterTracks(
      [{ ...tracks[0], name: 'Midnight Song' }, tracks[1]],
      { search: 'MIDnight' },
    )).toEqual([{ ...tracks[0], name: 'Midnight Song' }])
    expect(filterTracks(tracks, { search: '   ' })).toEqual(tracks)
  })

  it('matches any selected value within each filter', () => {
    expect(filterTracks(tracks, {
      author: ['A', 'B'],
      year: ['2024', '2023'],
      genre: ['Pop', 'Rock'],
    })).toEqual(tracks)
    expect(filterTracks(tracks, {
      author: ['A', 'B'],
      genre: ['Pop'],
    })).toEqual([tracks[1]])
  })
})
