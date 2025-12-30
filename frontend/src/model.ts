export interface FileModel {
  name: string | undefined
  type: string | undefined
  linkedTo: string | undefined
  bytes: number | undefined
  bytesReadable: number | undefined
  fullPath: string | undefined
  lastUpdate: string | undefined
  lastUpdateReadable: string | undefined
  directChildren: FileModel[] | undefined
  totalChildrenCount: number | undefined
}

export function tryParse(target: string): FileModel | undefined {
  try {
    let current = target.trim()
    if (current.endsWith(',')) current += '"":""}]}'
    else if (!current.endsWith('"}]}')) current += '"}]}'

    try {
      return JSON.parse(current) as FileModel
    } catch {
      let current = target.trim()
      if (!current.endsWith('"}]}')) current += '":""}]}'

      return JSON.parse(current) as FileModel
    }
  } catch {
    return undefined
  }
}
