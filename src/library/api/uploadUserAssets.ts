import { AxiosInstance } from 'axios'
import { UserAssets } from '../userAssets/userAssetTypes'
import { getS3Credentials } from './getS3Credentials'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { toast } from 'react-toastify'

const AWS_BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME
const AWS_REGION = import.meta.env.VITE_AWS_REGION

export const uploadUserAssets = ({
  authenticatedAxios,
  assets,
  fileName,
  workspaceUserName,
}: {
  authenticatedAxios: AxiosInstance
  assets: UserAssets
  fileName: string
  workspaceUserName: string
}) => {
  return getS3Credentials({ authenticatedAxios })
    .then((credentials) => {
      const { accessKeyId, secretAccessKey, sessionToken } = credentials
      const s3Client = new S3Client({
        region: AWS_REGION,
        credentials: { accessKeyId, secretAccessKey, sessionToken },
      })
      const command = new PutObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: `${workspaceUserName}/user-assets/${fileName}`,
        Body: new Blob([JSON.stringify(assets)], { type: 'application/json' }),
      })
      return s3Client.send(command)
    })
    .then((response) => {
      return response
    })
    .catch((error) => {
      toast.error('Failed to upload user assets')
      throw error
    })
}
