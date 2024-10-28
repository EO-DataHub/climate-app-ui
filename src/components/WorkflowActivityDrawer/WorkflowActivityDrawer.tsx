import { Badge, BadgeProps, Heading, IconButton, Text } from '@radix-ui/themes'
import { useContext, useEffect, useState } from 'react'
import CloseIcon from '@material-design-icons/svg/filled/close.svg?react'

import { AuthenticationContext } from '../../context/AuthenticationContext'
import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator'
import workflowAvtivityStyles from './WorkflowActivityDrawer.module.scss'
import { UserAssetsContext } from '../../context/UserAssetsContext'

interface WorkflowInfoFromApi {
  jobID: string
  started: string //date
  finished: string //date
  processID: string
  status: 'successful' | 'failed' | 'running'
  links: { title: 'Result location'; href: string }[]
}

export const WorkflowActivityDrawer = ({
  closeDrawer,
}: {
  closeDrawer: () => void
}) => {
  const [isWorkflowActivityError, setIsWorkflowActivityError] = useState(false)
  const [isWorkflowActivityLoading, setIsWorkflowActivityLoading] =
    useState(false)
  const [workflowActivity, setWorkflowActivity] = useState<
    WorkflowInfoFromApi[]
  >([])

  const { authenticatedAxios, workspaceUserName } = useContext(
    AuthenticationContext,
  )
  const { analysedUserAssets } = useContext(UserAssetsContext)

  useEffect(
    function loadWorkflowActivity() {
      if (!authenticatedAxios || !workspaceUserName) return

      setIsWorkflowActivityLoading(true)
      authenticatedAxios
        .get(
          `https://test.eodatahub.org.uk/ades/${workspaceUserName}/ogc-api/jobs`,
        )
        .then((response) => {
          const jobsSortedByDate = response.data.jobs.sort(
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
    },
    [authenticatedAxios, workspaceUserName, analysedUserAssets], // we want to refresh whenever analysedUserAssets has changes which indicated a workflow status has changes
  )

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
    <div className={workflowAvtivityStyles.overlay}>
      <div className={workflowAvtivityStyles.workflowActivityDrawer}>
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
          {!isWorkflowActivityLoading && !isWorkflowActivityError
            ? workflowActivity.map(({ jobID, status, started, finished }) => {
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
                      Date:{''}
                      {dateStringToUse ? (
                        `${new Date(dateStringToUse).toLocaleDateString()} ${new Date(dateStringToUse).toLocaleTimeString()}`
                      ) : (
                        <>unknown</>
                      )}
                    </Text>
                  </div>
                )
              })
            : null}
          {!isWorkflowActivityLoading && isWorkflowActivityError ? (
            <>
              Something went wrong when loading workflow activity information.
              You can try again by closing and opening this drawer.
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
