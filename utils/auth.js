function toReadableText(value) {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (Array.isArray(value)) {
    return value.map(toReadableText).filter(Boolean).join(' ')
  }

  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([field, detail]) => {
        const message = toReadableText(detail)
        return message ? `${field}: ${message}` : ''
      })
      .filter(Boolean)
      .join(' ')
  }

  return ''
}

export function getApiErrorMessage(error, fallback) {
  const data = error?.data
  const candidates = [
    data?.detail,
    data?.message,
    data?.error,
    data?.errors,
    data,
    error?.statusMessage,
    error?.message,
  ]

  for (const candidate of candidates) {
    const message = toReadableText(candidate)
    if (message) {
      return message
    }
  }

  return fallback
}
