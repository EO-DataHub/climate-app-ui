import {
  Badge,
  BadgeProps,
  Heading,
  IconButton,
  Link,
  Spinner,
  Text,
} from '@radix-ui/themes'
import { useContext, useEffect, useState, useCallback } from 'react'
import CloseIcon from '@material-design-icons/svg/filled/close.svg?react'
import { formatISO, subDays } from 'date-fns'

import { AuthenticationContext } from '../../context/AuthenticationContext'
import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator'
import workflowActivityStyles from './WorkflowActivityDrawer.module.scss'
import { UserAssetsContext } from '../../context/UserAssetsContext'
import {
  hubWorkflowNames,
  workflowNickNamesByHubWorkflowName,
} from '../../configuration/constants'
import { getResultsUrl } from '../../library/api/getUrls'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Drawer } from '../Drawer/Drawer'
import { deleteWorkflow } from '../../library/api/deleteWorkflow'
import { Prompt } from '../Prompt/Prompt'
import { getWorkspaceSessionTokens } from '../../library/api/getWorkspaceSessionToken'
import AuthenticatedAxios from '../../library/axios'

const HUB_BASE_URL = import.meta.env.VITE_WORKFLOW_BASE_URL
const HUB_APP_WORKSPACE_NAME = import.meta.env.VITE_HUB_APP_WORKSPACE_NAME

interface WorkflowInfoFromApi {
  jobID: string
  started: string //date
  finished: string //date
  processID: string
  status: 'successful' | 'failed' | 'running'
  links: { title: 'Result location'; href: string }[]
}

const workflowsSupportedByThisApp = Object.values(hubWorkflowNames)

export const WorkflowActivityDrawer = ({
  closeDrawer,
  isDrawerOpen,
}: {
  closeDrawer: () => void
  isDrawerOpen: boolean
}) => {
  const [isWorkflowActivityError, setIsWorkflowActivityError] = useState(false)
  const [isWorkflowActivityLoading, setIsWorkflowActivityLoading] =
    useState(false)
  const [workflowActivity, setWorkflowActivity] = useState<
    WorkflowInfoFromApi[]
  >([])
  const [isActivityBeingCleared, setIsActivityBeingCleared] = useState(false)
  const navigate = useNavigate()

  const { authenticatedAxios, workspaceUserName } = useContext(
    AuthenticationContext,
  )
  const [analysisIdWaitingToBeViewed, setAnalysisIdWaitingToBeViewed] =
    useState<WorkflowInfoFromApi['jobID'] | undefined>(undefined)
  const {
    analysedUserAssets,
    setAnalysedAssetsFileName,
    setAnalysedAssetsWorkflowNickname,
    setAnalysedAssetsWorkflowTitle,
    setAnalysedUserAssets,
    setAnalysisRunDate,
    setWorkflowJobIdAssociatedWithData,
    setProcessIdAssociatedWithData,
  } = useContext(UserAssetsContext)

  const loadWorkflowActivity = useCallback(async () => {
    if (!authenticatedAxios || !workspaceUserName) return

    if (isDrawerOpen) {
      setIsWorkflowActivityLoading(true)

      try {
        // Get workspace session token
        const { access } = await getWorkspaceSessionTokens({
          authenticatedAxios: authenticatedAxios,
          workspaceUserName,
        })

        const getUpdatedTokens = async () => {
          const { access }: { access: string } =
            await getWorkspaceSessionTokens({
              authenticatedAxios: authenticatedAxios,
              workspaceUserName,
            })
          return access
        }

        const workspaceAxiosInstance = new AuthenticatedAxios(
          access,
          getUpdatedTokens,
        )

        const endDate = new Date()
        const startDate = subDays(endDate, 7)
        const formattedDateRange = `${formatISO(startDate)}/${formatISO(endDate)}`

        const response = await workspaceAxiosInstance.authenticatedAxios.get(
          `${HUB_BASE_URL}/ades/${HUB_APP_WORKSPACE_NAME}/ogc-api/jobs?started=${formattedDateRange}&limit=100`,
        )

        const jobs = response.data.jobs as WorkflowInfoFromApi[]

        const jobsRelatedToWorkflowsInThisApp = jobs.filter(({ processID }) =>
          workflowsSupportedByThisApp.includes(processID),
        )

        const jobsSortedByDate = jobsRelatedToWorkflowsInThisApp.sort(
          (a: WorkflowInfoFromApi, b: WorkflowInfoFromApi) => {
            const dateStringToUseForA = a.finished ?? a.started
            const dateStringToUseForB = b.finished ?? b.started
            return new Date(dateStringToUseForB).getTime() >
              new Date(dateStringToUseForA).getTime()
              ? 1
              : -1
          },
        )
        setWorkflowActivity(jobsSortedByDate)
      } catch (error) {
        setIsWorkflowActivityError(true)
      } finally {
        setIsWorkflowActivityLoading(false)
      }
    }
  }, [authenticatedAxios, workspaceUserName, isDrawerOpen])

  useEffect(() => {
    void loadWorkflowActivity()
  }, [loadWorkflowActivity, analysedUserAssets])

  const viewAnalysis = async (jobId: string) => {
    const jobInfo = workflowActivity.find((job) => job.jobID === jobId)
    if (
      !jobInfo ||
      !setAnalysisRunDate ||
      !setAnalysedAssetsFileName ||
      !setWorkflowJobIdAssociatedWithData ||
      !setProcessIdAssociatedWithData ||
      !authenticatedAxios ||
      !workspaceUserName
    ) {
      toast.error('Error viewing analysis')
      return
    }

    try {
      // Get workspace session token
      const { access } = await getWorkspaceSessionTokens({
        authenticatedAxios,
        workspaceUserName,
      })

      const getUpdatedTokens = async () => {
        const { access }: { access: string } = await getWorkspaceSessionTokens({
          authenticatedAxios,
          workspaceUserName,
        })
        return access
      }

      const workspaceAxiosInstance = new AuthenticatedAxios(
        access,
        getUpdatedTokens,
      )

      const process_id = jobInfo.processID
      const resultsUrl = getResultsUrl({ workspaceUserName, jobId, process_id })

      const jobWorkflowNickname =
        workflowNickNamesByHubWorkflowName[jobInfo.processID]

      if (!jobWorkflowNickname || !resultsUrl) {
        toast.error('Error viewing analysis')
        return
      }

      setAnalysisIdWaitingToBeViewed(jobId)
      const {
        data: { data },
      } = await workspaceAxiosInstance.authenticatedAxios.get(resultsUrl)

      if (data) {
        setAnalysedUserAssets?.(data)
        setAnalysisRunDate(
          new Date(jobInfo.finished).toLocaleDateString('en-GB'),
        )
        setAnalysedAssetsFileName('placeholder-file-name')
        setWorkflowJobIdAssociatedWithData(jobId)
        setProcessIdAssociatedWithData(process_id)
        setAnalysedAssetsWorkflowNickname?.(
          workflowNickNamesByHubWorkflowName[jobInfo.processID],
        )
        setAnalysedAssetsWorkflowTitle?.(
          workflowNickNamesByHubWorkflowName[jobInfo.processID] ?? null,
        )
        closeDrawer()
        setTimeout(() => {
          navigate('/analytics')
        }, 1000)
      } else {
        toast.error('Error viewing analysis')
      }
    } catch (error) {
      toast.error('Error viewing analysis')
    } finally {
      setAnalysisIdWaitingToBeViewed(undefined)
    }
  }

  const cancelAnalysis = async (jobId: string) => {
    if (!authenticatedAxios || !workspaceUserName) {
      toast.error('Error cancelling analysis: authentication not available')
      return
    }

    try {
      // Get workspace session token
      const { access } = await getWorkspaceSessionTokens({
        authenticatedAxios,
        workspaceUserName,
      })

      const getUpdatedTokens = async () => {
        const { access }: { access: string } = await getWorkspaceSessionTokens({
          authenticatedAxios,
          workspaceUserName,
        })
        return access
      }

      const workspaceAxiosInstance = new AuthenticatedAxios(
        access,
        getUpdatedTokens,
      )

      await deleteWorkflow({
        jobId,
        authenticatedAxios: workspaceAxiosInstance.authenticatedAxios,
      })
      await loadWorkflowActivity()
      toast.dismiss()
      toast.success('Analysis cancelled.')
    } catch (error) {
      toast.error('Error cancelling analysis.')
    }
  }

  const clearAll = async () => {
    if (!authenticatedAxios || !workspaceUserName) {
      toast.error('Error clearing activity: authentication not available')
      return
    }

    try {
      // Get workspace session token
      const { access } = await getWorkspaceSessionTokens({
        authenticatedAxios,
        workspaceUserName,
      })

      const getUpdatedTokens = async () => {
        const { access }: { access: string } = await getWorkspaceSessionTokens({
          authenticatedAxios,
          workspaceUserName,
        })
        return access
      }

      const workspaceAxiosInstance = new AuthenticatedAxios(
        access,
        getUpdatedTokens,
      )

      const deletePromises = workflowActivity.map(({ jobID }) =>
        deleteWorkflow({
          jobId: jobID,
          authenticatedAxios: workspaceAxiosInstance.authenticatedAxios,
        }),
      )
      setIsActivityBeingCleared(true)
      await Promise.all(deletePromises)
      setWorkflowActivity([])
      toast.dismiss()
      toast.success('All activity has been cleared.')
    } catch (error) {
      toast.error('Error clearing activity.')
    } finally {
      setIsActivityBeingCleared(false)
    }
  }

  const badgeColor = {
    successful: 'green',
    failed: 'red',
    running: 'blue',
  }

  const badgeText = {
    successful: 'Analysis Complete',
    failed: 'Analysis Error',
    running: 'Analysis In-Progress',
  }

  return (
    <Drawer isDrawerOpen={isDrawerOpen}>
      <div className={workflowActivityStyles.drawerHeader}>
        <Heading as="h3">Activity</Heading>
        <IconButton
          aria-label="Close workflow activity drawer"
          variant="ghost"
          size="1"
        >
          <CloseIcon
            onClick={closeDrawer}
            aria-label="Close workflow activity drawer"
          />
        </IconButton>
      </div>

      <div className={workflowActivityStyles.activityList}>
        {!isWorkflowActivityLoading &&
        !isWorkflowActivityError &&
        workflowActivity.length > 0 ? (
          <div className={workflowActivityStyles.aboveActivityListRow}>
            <Link asChild size="1">
              <button
                className={workflowActivityStyles.workflowActivityButton}
                onClick={clearAll}
              >
                {isActivityBeingCleared ? <Spinner /> : null}
                Clear All
              </button>
            </Link>
          </div>
        ) : null}
        {isWorkflowActivityLoading ? <LoadingIndicator /> : null}
        {!isWorkflowActivityLoading &&
        !isWorkflowActivityError &&
        workflowActivity.length === 0 ? (
          <>There is no activity to show for the current user</>
        ) : null}
        {!isWorkflowActivityLoading && !isWorkflowActivityError
          ? workflowActivity.map(
              ({ jobID, status, started, finished, processID }) => {
                const dateStringToUse = finished ?? started
                return (
                  <div
                    key={jobID}
                    className={workflowActivityStyles.activityCard}
                  >
                    <Badge color={badgeColor[status] as BadgeProps['color']}>
                      {badgeText[status]}
                    </Badge>
                    <Text color="gray" size="1">
                      Type: {workflowNickNamesByHubWorkflowName[processID]}
                    </Text>
                    <div className={workflowActivityStyles.dateRow}>
                      <Text color="gray" size="1">
                        Date:
                        {dateStringToUse ? (
                          ` ${new Date(dateStringToUse).toLocaleDateString('en-GB')} ${new Date(dateStringToUse).toLocaleTimeString()}`
                        ) : (
                          <>unknown</>
                        )}
                      </Text>
                      {status === 'successful' ? (
                        <Link asChild size="1">
                          <button
                            onClick={() => void viewAnalysis(jobID)}
                            className={
                              workflowActivityStyles.workflowActivityButton
                            }
                            disabled={!!analysisIdWaitingToBeViewed}
                          >
                            {analysisIdWaitingToBeViewed === jobID ? (
                              <Spinner />
                            ) : null}
                            View Analysis
                          </button>
                        </Link>
                      ) : null}
                      {status === 'running' ? (
                        <Prompt
                          trigger={
                            <Link asChild size="1">
                              <button
                                className={
                                  workflowActivityStyles.workflowActivityButton
                                }
                              >
                                Cancel Analysis
                              </button>
                            </Link>
                          }
                          onConfirm={() => void cancelAnalysis(jobID)}
                          promptText="Do you want to cancel the ongoing analysis?"
                        />
                      ) : null}
                    </div>
                  </div>
                )
              },
            )
          : null}
        {!isWorkflowActivityLoading && isWorkflowActivityError ? (
          <>
            We&apos;re sorry. Something went wrong when loading workflow
            activity information. You can try again by closing and opening this
            drawer.
          </>
        ) : null}
      </div>
    </Drawer>
  )
}
