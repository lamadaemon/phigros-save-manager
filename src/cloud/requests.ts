export interface S2CRequestCreateFileToken {
    bucket: string
    createdAt: string
    key: string
    metaData: FileTokenMeta
    mime_type: string
    name: string
    objectId: string
    provider: string
    token: string
    upload_url: string
    url: string
}
  
export interface FileTokenMeta {
    _checksum: string
    prefix: string
    size: number
}
export interface S2CRequestCreateUpload {
   uploadId: string
   expireAt: number
}

export interface S2CRequestUploadPart {
    etag: string
    md5: string
}

export interface FilePartInfo {
    partNumber: number,
    etag: string
}

export interface S2CRequestFileUploadComplete {
    hash: string
    key: string
}

