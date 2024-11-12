import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Button, Dialog } from '@radix-ui/themes'
import { DateField } from '@mui/x-date-pickers/DateField'
import { DateValidationError } from '@mui/x-date-pickers/models'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import ArrowLeft from '../../../localAssets/arrow-left.svg?react'
import CloseIcon from '@material-design-icons/svg/filled/close.svg?react'
import dayjs, { Dayjs } from 'dayjs'

import { capitalizeFirstLetter } from '../../../library/strings/capitalizeFirstLetter'
import { getHumanFriendlyListFromArray } from '../../../library/arrays/getHumanFriendlyListFromArray'
import { HubWorkflowOptions } from '../../../library/api/apiTypes'
import { IconButtonOverride } from '../../IconButtonOverride/IconButtonOverride'
import { ReactNode, useEffect, useState } from 'react'
import { workflowOptions } from '../../../library/api/fakeApiData'
import containerStyles from '../../../library/genericStyles/containers.module.scss'
import formStyles from '../../../library/genericStyles/forms.module.scss'
import modalStyles from './WorkflowModalContent.module.scss'
import { HandleAnalyseAssetsProps } from './assetsTypes'

type DateErrorType = DateValidationError | 'required' | null

const defaultEndDate = dayjs()
const defaultStartDate = defaultEndDate.subtract(1, 'month')
const errorMessages: Record<string, string> = {
  required: 'This field is required.',
  disableFuture: 'Future dates are not allowed.',
}
const getDateErrorMessage = (error: DateErrorType) => {
  if (!error) {
    return null
  }

  return errorMessages[error] ?? 'There is an error with this field.'
}
const WorkflowInformation = ({
  inputContent,
  workflowOptions,
}: {
  inputContent: ReactNode
  workflowOptions: HubWorkflowOptions
}) => {
  const {
    title,
    description,
    constraints: {
      required_columns: requiredColumns,
      supported_assets: supportedGeometries,
    },
  } = workflowOptions
  const supportedGeometriesToUse = supportedGeometries.filter(Boolean)

  const supportedGeometriesString = getHumanFriendlyListFromArray(
    supportedGeometriesToUse,
  )

  return (
    <div className={modalStyles.workflowInformation}>
      <p>{title}</p>
      <p>{description}</p>
      <p>
        This workflow requires the following columns:
        <br />
        {requiredColumns.join(', ')}
      </p>
      {supportedGeometriesToUse.length >= 1 &&
      supportedGeometriesToUse.length < 3 ? (
        <p>
          Only {supportedGeometriesString} are supported. Other geometires
          cannot be analysed
        </p>
      ) : null}
      {supportedGeometriesToUse.length === 3 ? (
        <p>{capitalizeFirstLetter(supportedGeometriesString)} are supported.</p>
      ) : null}
      {supportedGeometriesToUse.length < 1 ? (
        <p>Supported geometry information is missing.</p>
      ) : null}

      {inputContent}
    </div>
  )
}

export const WorkflowModalContent = ({
  handleAnalyseAssets,
}: {
  handleAnalyseAssets: (props: HandleAnalyseAssetsProps) => void
}) => {
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [endDateError, setEndDateError] = useState<DateErrorType>(null)
  const [selectedWorkflowOptions, setSelectedWorkflowOptions] =
    useState<HubWorkflowOptions | null>(null)
  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [startDateError, setStartDateError] = useState<DateErrorType>(null)

  const hubWorkflowName = selectedWorkflowOptions?.preset_inputs.workflow
  const hubWorkflowPresetInputs = selectedWorkflowOptions?.preset_inputs
  const isHubWorkflowErrorShowing = !hubWorkflowName || !hubWorkflowPresetInputs
  const areDateRangeInputsShowing =
    selectedWorkflowOptions?.user_inputs.start_date &&
    selectedWorkflowOptions?.user_inputs.end_date

  const initializeDateRangeValues = () => {
    if (areDateRangeInputsShowing) {
      setStartDate(defaultStartDate)
      setEndDate(defaultEndDate)
    }
    if (!areDateRangeInputsShowing) {
      // to ensure that we dont send date values to workflows that dont support them
      setStartDate(null)
      setEndDate(null)
    }
  }

  useEffect(initializeDateRangeValues, [areDateRangeInputsShowing])

  const hackToEnforceMuiRequiredDateValues = ({
    newValue,
    setValue,
    setError,
  }: {
    newValue: Dayjs | null
    setValue: (newValue: Dayjs | null) => void
    setError: (newError: DateErrorType) => void
  }) => {
    if (!newValue) {
      setTimeout(() => {
        setError('required')
      }, 500) // timeout becasue even when no error, MUI onError gets called with a null value. We want to ensure this is the one that gets set and sticks
    }
    setValue(newValue)
  }

  const handleSelectWorkflow = (workflowOptions: HubWorkflowOptions) => {
    setSelectedWorkflowOptions(workflowOptions)
    initializeDateRangeValues()
    setStartDateError(null)
    setEndDateError(null)
  }

  const returnToSelectWorkflow = () => {
    setSelectedWorkflowOptions(null)
  }

  const selectWorkflowView = (
    <ul className={modalStyles.workflowList}>
      {workflowOptions.map((workflowOptions) => {
        const { title } = workflowOptions

        const selectAnalysisButton = (
          <Button
            variant="outline"
            onClick={() =>
              handleSelectWorkflow(workflowOptions as HubWorkflowOptions)
            }
          >
            Select Workflow
          </Button>
        )

        return (
          <li key={title}>
            <WorkflowInformation
              inputContent={selectAnalysisButton}
              workflowOptions={workflowOptions as HubWorkflowOptions}
            />
          </li>
        )
      })}
    </ul>
  )
  const dateRangeInputs = (
    <div className={modalStyles.dateInputs}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <label className={formStyles.formLabel}>
          Start Date
          <DateField
            value={startDate}
            onChange={(newValue) => {
              hackToEnforceMuiRequiredDateValues({
                newValue,
                setValue: setStartDate,
                setError: setStartDateError,
              })
            }}
            onError={setStartDateError}
            slotProps={{
              textField: {
                helperText: startDateError
                  ? getDateErrorMessage(startDateError)
                  : ' ', // the space reserves helper text space so that we can keep alignment when one field has error text while the other doesnt
                fullWidth: true,
                error: !!startDateError,
              },
            }}
            disableFuture
          />
        </label>

        <label className={formStyles.formLabel}>
          End Date
          <DateField
            value={endDate}
            onChange={(newValue) => {
              hackToEnforceMuiRequiredDateValues({
                newValue,
                setValue: setEndDate,
                setError: setEndDateError,
              })
            }}
            onError={setEndDateError}
            size="small"
            slotProps={{
              textField: {
                helperText: endDateError
                  ? getDateErrorMessage(endDateError)
                  : ' ', // the space reserves helper text space so that we can keep alignment when one field has error text while the other doesnt
                fullWidth: true,
                error: !!endDateError,
              },
            }}
            disableFuture
            required
          />
        </label>
      </LocalizationProvider>
    </div>
  )
  const workflowInputs = areDateRangeInputsShowing ? dateRangeInputs : null

  const userInputsView = selectedWorkflowOptions ? (
    <div>
      {isHubWorkflowErrorShowing ? (
        <p className={modalStyles.workflowError}>
          Sorry, the configuration for this workflow is broken on our end.
          Please select another workflow.
        </p>
      ) : null}
      <Button variant="ghost" onClick={returnToSelectWorkflow}>
        <ArrowLeft /> Back
      </Button>

      {selectedWorkflowOptions ? (
        <WorkflowInformation
          workflowOptions={selectedWorkflowOptions}
          inputContent={workflowInputs}
        />
      ) : null}
      <Button
        variant="outline"
        onClick={() =>
          handleAnalyseAssets({
            startDate: startDate?.format('YYYY-MM-DD'),
            endDate: endDate?.format('YYYY-MM-DD'),
            hubWorkflowPresetInputs: hubWorkflowPresetInputs,
          })
        }
        disabled={!!startDateError || !!endDateError || !hubWorkflowName}
      >
        Run Analysis
      </Button>
    </div>
  ) : null
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
      {!selectedWorkflowOptions ? selectWorkflowView : null}
      {selectedWorkflowOptions ? userInputsView : null}
    </>
  )
}
