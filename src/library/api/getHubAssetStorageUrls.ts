const getHubAssetStorageUrl = ({
  workspaceUserName,
}: {
  workspaceUserName: string
}) =>
  `https://${workspaceUserName}.workspaces.test.eodhp.eco-ke-staging.com/files/eodhp-test-workspaces1/user-assets`

export const getHubAssetStorageUrlForFile = ({
  fileName,
  workspaceUserName,
}: {
  fileName: string
  workspaceUserName: string
}) => `${getHubAssetStorageUrl({ workspaceUserName })}/${fileName}`

export const getRelativeS3PathForAssetFile = ({
  fileName,
  workspaceUserName,
}: {
  fileName: string
  workspaceUserName: string
}) => `${workspaceUserName}/user-assets/${fileName}`
