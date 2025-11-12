export interface FileModel {
  name: string
  type: string
  linkedTo: string | undefined
  bytes: number | undefined
  fullPath: string
  lastUpdate: string
}