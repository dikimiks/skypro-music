import { describe, expect, it } from 'vitest'
import { getApiErrorMessage } from '../utils/auth.js'

describe('API error messages', () => {
  it('uses a readable server detail message', () => {
    expect(getApiErrorMessage(
      { data: { detail: 'Этот адрес уже зарегистрирован.' } },
      'Не удалось зарегистрироваться.',
    )).toBe('Этот адрес уже зарегистрирован.')
  })

  it('formats field errors returned as arrays', () => {
    expect(getApiErrorMessage(
      { data: { email: ['Некорректный адрес.'], password: ['Слишком короткий пароль.'] } },
      'Не удалось зарегистрироваться.',
    )).toBe('email: Некорректный адрес. password: Слишком короткий пароль.')
  })

  it('uses the fallback when the response has no message', () => {
    expect(getApiErrorMessage({}, 'Не удалось зарегистрироваться.'))
      .toBe('Не удалось зарегистрироваться.')
  })
})
