export interface S2CRequestSave {
    results: PlayerProfile[]
}
  
export interface PlayerProfile {
  createdAt: string
  gameFile: GameFile
  modifiedAt: ModifiedAt
  name: string
  objectId: string
  summary: string
  updatedAt: string
  user: User
}

export interface GameFile {
  __type: string
  bucket: string
  createdAt: string
  key: string
  metaData: MetaData
  mime_type: string
  name: string
  objectId: string
  provider: string
  updatedAt: string
  url: string
}

export interface MetaData {
  _checksum: string
  prefix: string
  size: number
}

export interface ModifiedAt {
  __type: string
  iso: string
}

export interface User {
  __type: string
  className: string
  objectId: string
}
  