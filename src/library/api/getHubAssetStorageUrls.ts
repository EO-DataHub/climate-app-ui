const AWS_BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME

export const getRelativeS3PathForAssetFile = ({
  fileName,
  workspaceUserName,
}: {
  fileName: string
  workspaceUserName: string
}) => {
  if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
    return fileName
  }
  return `s3://${AWS_BUCKET_NAME}/${workspaceUserName}/user-assets/${fileName}`
}
