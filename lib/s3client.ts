import { S3Client } from '@aws-sdk/client-s3'

const {
  LINODE_OBJECT_STORAGE_REGION: region,
  LINODE_OBJECT_STORAGE_ENDPOINT: endpoint,
  LINODE_OBJECT_STORAGE_FORCE_PATH_STYLE,
  LINODE_OBJECT_STORAGE_ACCESS_KEY_ID,
  LINODE_OBJECT_STORAGE_SECRET_ACCESS_KEY,
} = process.env

const forcePathStyle =
  LINODE_OBJECT_STORAGE_FORCE_PATH_STYLE?.toLowerCase() === 'true'
const accessKeyId = LINODE_OBJECT_STORAGE_ACCESS_KEY_ID ?? ''
const secretAccessKey = LINODE_OBJECT_STORAGE_SECRET_ACCESS_KEY ?? ''

export default new S3Client({
  region,
  endpoint,
  forcePathStyle,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})
