import { Button, Dialog } from '@radix-ui/themes'
import CloseIcon from '@material-design-icons/svg/filled/close.svg?react'

import { IconButtonOverride } from '../../IconButtonOverride/IconButtonOverride'
import { workflowOptions } from '../../../library/api/fakeApiData'
import containerStyles from '../../../library/genericStyles/containers.module.scss'
import modalStyles from './WorkflowModalContent.module.scss'
import {
  HubWorkflowNicknamesType,
  workflowNickNamesByHubWorkflowName,
} from '../../../configuration/constants'

export const WorkflowModalContent = ({
  handleAnalyseAssets,
}: {
  handleAnalyseAssets: ({
    workflowTitle,
  }: {
    workflowTitle: HubWorkflowNicknamesType
  }) => void
}) => {
  return (
    <>
      <div className={containerStyles.modalTopRow}>
        <Dialog.Title>Select Workflow</Dialog.Title>
        <Dialog.Close>
          <IconButtonOverride
            variant="ghost"
            className="close"
            aria-label="Close select workflow modal"
          >
            <CloseIcon />
          </IconButtonOverride>
        </Dialog.Close>
      </div>
      <ul className={modalStyles.workflowList}>
        {workflowOptions.map(
          ({
            title,
            description,
            constraints: { required_columns: requiredColumns },
            preset_inputs: { workflow },
          }) => {
            const nickname = workflowNickNamesByHubWorkflowName[workflow]
            return (
              <li key={title}>
                <p>{title}</p>
                <p>{description}</p>
                <p>
                  This workflow requires the following columns:
                  <br />
                  {requiredColumns.join(', ')}
                </p>
                {/* IMPORTANT! This will currently initiate the OS-C workflow regardless
								 of which workflow is selected. We're leaving this until both workflows
								 are working again */}
                <Button
                  variant="outline"
                  onClick={() =>
                    handleAnalyseAssets({
                      workflowTitle: nickname as HubWorkflowNicknamesType,
                    })
                  }
                >
                  Run {nickname} Analysis
                </Button>
              </li>
            )
          },
        )}
      </ul>
    </>
  )
}
