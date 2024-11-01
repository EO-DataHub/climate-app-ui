import {
  Badge,
  BadgeProps,
  Heading,
  IconButton,
  Link,
  Spinner,
  Text,
} from '@radix-ui/themes'
import { useContext, useEffect, useState } from 'react'
import CloseIcon from '@material-design-icons/svg/filled/close.svg?react'

import { AuthenticationContext } from '../../context/AuthenticationContext'
import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator'
import workflowAvtivityStyles from './WorkflowActivityDrawer.module.scss'
import { UserAssetsContext } from '../../context/UserAssetsContext'
import {
  hubWorkflowNames,
  workflowNickNamesByHubWorkflowName,
} from '../../configuration/constants'
import { getResultsUrl } from '../../library/api/getResultsUrl'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Drawer } from '../Drawer/Drawer'

const HUB_BASE_URL = import.meta.env.VITE_HUB_BASE_URL

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
  const navigate = useNavigate()

  const { authenticatedAxios, workspaceUserName } = useContext(
    AuthenticationContext,
  )
  const [analysisIdWaitingToBeViewed, setAnalysisIdWaitingToBeViewed] =
    useState<WorkflowInfoFromApi['jobID'] | undefined>(undefined)
  const {
    analysedUserAssets,
    setAnalysedUserAssets,
    setCurrentWorkflowNickname,
  } = useContext(UserAssetsContext)

  useEffect(
    function loadWorkflowActivity() {
      if (!authenticatedAxios || !workspaceUserName) return

      if (isDrawerOpen) {
        setIsWorkflowActivityLoading(true)
        authenticatedAxios
          .get(`${HUB_BASE_URL}/ades/${workspaceUserName}/ogc-api/jobs`)
          .then((response) => {
            const jobs = response.data.jobs as WorkflowInfoFromApi[]

            const jobsRelatedToWorkflowsInThisApp = jobs.filter(
              ({ processID }) =>
                workflowsSupportedByThisApp.includes(processID),
            )

            const jobsSortedByDate = jobsRelatedToWorkflowsInThisApp.sort(
              (a: WorkflowInfoFromApi, b: WorkflowInfoFromApi) => {
                // UX requirement: show date analysis was started, or Date Error occurred or Date analysis was completed
                const dateStringToUseForA = a.finished ?? a.started
                const dateStringToUseForB = b.finished ?? b.started
                return new Date(dateStringToUseForB).getTime() >
                  new Date(dateStringToUseForA).getTime()
                  ? 1
                  : -1
              },
            )
            setWorkflowActivity(jobsSortedByDate)
          })
          .catch(() => {
            setIsWorkflowActivityError(true)
          })
          .finally(() => {
            setIsWorkflowActivityLoading(false)
          })
      }
    },
    [authenticatedAxios, workspaceUserName, analysedUserAssets, isDrawerOpen], // we want to refresh whenever analysedUserAssets has changes which indicated a workflow status has changes
  )

  const viewAnalysis = (jobId: string) => {
    const jobInfo = workflowActivity.find((job) => job.jobID === jobId)
    if (!jobInfo || !workspaceUserName) {
      toast.error('Error viewing analysis')
      return
    }

    const resultsUrl = getResultsUrl({ workspaceUserName, jobId })

    const jobWorkflowNickname =
      workflowNickNamesByHubWorkflowName[jobInfo.processID]

    if (!jobWorkflowNickname || !resultsUrl) {
      toast.error('Error viewing analysis')
      return
    }

    setAnalysisIdWaitingToBeViewed(jobId)
    authenticatedAxios
      ?.get(resultsUrl)
      .then(({ data: { data } }) => {
        if (data) {
          setCurrentWorkflowNickname?.(
            workflowNickNamesByHubWorkflowName[jobInfo.processID],
          )
          setAnalysedUserAssets?.(data)
          closeDrawer()
          navigate('/analytics')
        }
        if (!data) {
          toast.error('Error viewing analysis')
        }
      })
      .catch(() => {
        toast.error('Error viewing analysis')
      })
      .finally(() => {
        setAnalysisIdWaitingToBeViewed(undefined)
      })
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
      <div className={workflowAvtivityStyles.drawerHeader}>
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
      <div className={workflowAvtivityStyles.activityList}>
        {isWorkflowActivityLoading ? <LoadingIndicator /> : null}
        {!isWorkflowActivityLoading &&
        !isWorkflowActivityError &&
        workflowActivity.length === 0 ? (
          <>There is no activity to show for the current user</>
        ) : null}
        {!isWorkflowActivityLoading && !isWorkflowActivityError
          ? workflowActivity.map(
              ({ jobID, status, started, finished, processID }) => {
                // UX requirement: show date analysis was started, or Date Error occurred or Date analysis was completed
                const dateStringToUse = finished ?? started
                return (
                  <div
                    key={jobID}
                    className={workflowAvtivityStyles.activityCard}
                  >
                    <Badge color={badgeColor[status] as BadgeProps['color']}>
                      {badgeText[status]}
                    </Badge>
                    <Text
                      weight="bold"
                      size="3"
                      className={workflowAvtivityStyles.portfolioName}
                    >
                      Portfolio Name Here
                    </Text>
                    <Text color="gray" size="1">
                      Type: {workflowNickNamesByHubWorkflowName[processID]}
                    </Text>
                    <div className={workflowAvtivityStyles.dateRow}>
                      <Text color="gray" size="1">
                        Date:{''}
                        {dateStringToUse ? (
                          `${new Date(dateStringToUse).toLocaleDateString()} ${new Date(dateStringToUse).toLocaleTimeString()}`
                        ) : (
                          <>unknown</>
                        )}
                      </Text>
                      {status === 'successful' ? (
                        <Link asChild size="1">
                          <button
                            onClick={() => viewAnalysis(jobID)}
                            className={
                              workflowAvtivityStyles.viewAnalysisButton
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
