export const getResultsUrl = ({
  workspaceUserName,
  jobId,
}: {
  jobId: string
  workspaceUserName: string
}) =>
  `https://${workspaceUserName}.workspaces.test.eodhp.eco-ke-staging.com/files/eodhp-test-workspaces1/processing-results/cat_${jobId}.json`

export const getCsvResultsUrl = ({
  workspaceUserName,
  jobId,
}: {
  jobId: string
  workspaceUserName: string
}) =>
  `https://${workspaceUserName}.workspaces.test.eodhp.eco-ke-staging.com/files/eodhp-test-workspaces1/processing-results/cat_${jobId}/col_${jobId}/data.csv`
