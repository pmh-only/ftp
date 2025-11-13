import type { FileModel } from "../model";

const rtf = new Intl.RelativeTimeFormat('en')
const now = Date.now()

export function getLastUpdateRelative(item: FileModel): [string, string] {
  const lastUpdate = +new Date(item.lastUpdate ?? Infinity)
  const lastUpdateRelativeNumber = now - lastUpdate

  if (lastUpdateRelativeNumber < 1000)
    return ['now', 'text-red-500']

  if (lastUpdateRelativeNumber < 60 * 1000)
    return [rtf.format(-Math.floor(lastUpdateRelativeNumber / 1000), 'seconds'), 'text-red-500']

  if (lastUpdateRelativeNumber < 60 * 60 * 1000)
    return [rtf.format(-Math.floor(lastUpdateRelativeNumber / 60 / 1000), 'minutes'), 'text-red-500']

  if (lastUpdateRelativeNumber < 24 * 60 * 60 * 1000)
    return [rtf.format(-Math.floor(lastUpdateRelativeNumber / 60 / 60 / 1000), 'hours'), 'text-red-500']

  if (lastUpdateRelativeNumber < 30 * 24 * 60 * 60 * 1000)
    return [rtf.format(-Math.floor(lastUpdateRelativeNumber / 24 / 60 / 60 / 1000), 'days'), 'text-orange-500']

  return [rtf.format(-Math.floor(lastUpdateRelativeNumber / 24 / 60 / 60 / 1000), 'days'), 'text-neutral-500']
}