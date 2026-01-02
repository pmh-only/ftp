const now = Date.now()
const rtf = new Intl.RelativeTimeFormat('en')

export function getRelative(
  date: string | number | undefined
): [string, string] {
  if (!date) {
    return ['', '']
  }

  const lastUpdate = +new Date(date)
  const lastUpdateRelativeNumber = now - lastUpdate

  if (lastUpdateRelativeNumber < 1000) return ['now', 'text-red-500']

  if (lastUpdateRelativeNumber < 60 * 60 * 1000)
    return [
      rtf.format(-Math.floor(lastUpdateRelativeNumber / 60 / 1000), 'minutes'),
      'text-red-500'
    ]

  if (lastUpdateRelativeNumber < 5 * 60 * 60 * 1000)
    return [
      rtf.format(
        -Math.floor(lastUpdateRelativeNumber / 60 / 60 / 1000),
        'hours'
      ),
      'text-red-500'
    ]

  if (lastUpdateRelativeNumber < 24 * 60 * 60 * 1000)
    return [
      rtf.format(
        -Math.floor(lastUpdateRelativeNumber / 60 / 60 / 1000),
        'hours'
      ),
      'text-orange-500'
    ]

  if (lastUpdateRelativeNumber < 7 * 24 * 60 * 60 * 1000)
    return [
      rtf.format(
        -Math.floor(lastUpdateRelativeNumber / 24 / 60 / 60 / 1000),
        'days'
      ),
      'text-amber-500'
    ]

  if (lastUpdateRelativeNumber < 30 * 24 * 60 * 60 * 1000)
    return [
      rtf.format(
        -Math.floor(lastUpdateRelativeNumber / 24 / 60 / 60 / 1000),
        'days'
      ),
      'text-yellow-500'
    ]

  return [
    rtf.format(
      -Math.floor(lastUpdateRelativeNumber / 24 / 60 / 60 / 1000),
      'days'
    ),
    'text-neutral-500'
  ]
}
