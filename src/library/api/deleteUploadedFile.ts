import { AxiosInstance } from 'axios'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getS3Credentials } from './getS3Credentials'

const AWS_BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME
const AWS_REGION = import.meta.env.VITE_AWS_REGION

export const deleteUploadedFile = ({
  authenticatedAxios,
  fileName,
  workspaceUserName,
}: {
  authenticatedAxios: AxiosInstance
  fileName: string
  workspaceUserName: string
}) => {
  return getS3Credentials({ authenticatedAxios }).then((credentials) => {
    const { accessKeyId, secretAccessKey, sessionToken } = credentials
    const s3Client = new S3Client({
      region: AWS_REGION,
      credentials: { accessKeyId, secretAccessKey, sessionToken },
    })
    const command = new DeleteObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: `${workspaceUserName}/user-assets/${fileName}`,
    })
    return s3Client.send(command)
  })
}
