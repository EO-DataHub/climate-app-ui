import axios from 'axios'
import {
  Button,
  Heading,
  Link,
  TextField,
  Text,
  Dialog,
} from '@radix-ui/themes'
import { useContext, useState } from 'react'

import {
  RowSelection,
  UserAssets,
} from '../../../library/userAssets/userAssetTypes'
import { analyseAssets } from '../../../library/userAssets/analyseAssets'
import { AssetsSelect } from '../../AssetsSelect/AssetsSelect'
import { AssetsTable } from '../../AssetsTable/AssetsTable'
import { AuthenticationContext } from '../../../context/AuthenticationContext'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Map } from '../../Map/Map'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { toast } from 'react-toastify'
import { UploadButtonAndDialog } from '../../UploadButtonAndDialog/UploadButtonAndDialog'
import { useMap } from '../../Map/useMap'
import { UserAssetsContext } from '../../../context/UserAssetsContext'
import assetStyles from './Assets.module.scss'
import sidebarStyles from '../../Layout/Sidebar.module.scss'
import { WorkflowModalContent } from './WorkflowModalContent'

export const Assets = () => {
  const [analysisResultsBearerToken, setAnalysisResultsBearerToken] =
    useState('') // temporary until we have better IAM
  const [currentWorkflowTitle, setCurrentWorkflowTitle] = useState<
    string | undefined
  >()
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false)
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelection>({})
  const { isAuthenticated, login } = useContext(AuthenticationContext)
  const { mapContainer, mapRef, isMapLoaded } = useMap()
  const {
    setAnalysedUserAssets,
    setUserAssets,
    userAssets,
    setUploadedFileName,
    uploadedFileName,
  } = useContext(UserAssetsContext)

  const handleLoadAssets = ({
    fileName,
    parsedAssets,
  }: {
    fileName: string
    parsedAssets: UserAssets
  }) => {
    setCurrentWorkflowTitle(undefined)
    setRowSelection({})
    setUserAssets?.(parsedAssets)
    setUploadedFileName?.(fileName)
  }

  const handleAnalyseAssets = ({
    workflowTitle,
  }: {
    workflowTitle: string
  }) => {
    if (!userAssets) {
      throw new Error('handleAnalyseAssets has a missing userAssets parameter')
    }
    if (!setAnalysedUserAssets) {
      throw new Error(
        'handleAnalyseAssets has a missing setAnalysedUserAssets parameter',
      )
    }

    if (!isAuthenticated) {
      void login()
      return
    }
    toast.dismiss()

    toast(
      <>
        <strong>Analysis in Progress</strong>
        <br />
        You will receive a notification when it&apos;s ready.
      </>,
    )
    setCurrentWorkflowTitle(workflowTitle)
    setIsWorkflowModalOpen(false)
    setIsAnalysisRunning(true)
    analyseAssets({
      userAssets,
      analysisResultsBearerToken,
      axios,
    })
      .then((results) => {
        setAnalysedUserAssets(results)
        // eslint-disable-next-line no-console
        console.log('Risk analysis results:', results)
        toast.dismiss()
        toast(
          <div
            className={assetStyles.analysisSuccessToastMessageAndButtonWrapper}
          >
            <div className={assetStyles.analysisSuccessToastMessage}>
              <strong>
                {workflowTitle} Analysis complete{' '}
                {uploadedFileName ? <>for</> : null}
              </strong>
              {uploadedFileName ? uploadedFileName : null}
            </div>

            <Button asChild variant="soft">
              <ReactRouterLink to="/analytics">View Analysis</ReactRouterLink>
            </Button>
          </div>,
        )
      })
      .catch(() => {
        toast.dismiss()
        toast.error('An error occurred during the analysis. Please try again.')
      })
      .finally(() => {
        setIsAnalysisRunning(false)
      })
  }

  const sidebarContent = (
    <div className={sidebarStyles.content}>
      <div className={assetStyles.sidebarTopSection}>
        <div className={assetStyles.selectPortfolioRow}>
          <div className={assetStyles.assetsSelectWrapper}>
            <label>Portfolios</label>
            <AssetsSelect />
          </div>
          <UploadButtonAndDialog onLoadAssets={handleLoadAssets} />
        </div>
        {!userAssets ? (
          <div className={assetStyles.uploadGuildelinesWrapper}>
            <Heading as="h3" size="3">
              Please adhere to these guidelines before adding a file:
            </Heading>
            <Heading as="h4" size="3">
              File types accepted
            </Heading>
            <p>CSV or GeoJSON FeatureCollection</p>
            <Heading as="h4" size="3">
              File attributes must include
            </Heading>
            <p>id, latitude, and longitude</p>
            <Heading as="h4" size="3">
              Note
            </Heading>
            <p>
              Specific asset analysis workflows may require further attributes
            </p>
            <p>
              You can also download a csv template{' '}
              <Link href="/template.csv" download>
                here
              </Link>
            </p>
          </div>
        ) : null}
        <AssetsTable
          isMapLoaded={isMapLoaded}
          mapRef={mapRef}
          userAssets={userAssets}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>

      <div className={assetStyles.analyseButtonRow}>
        {userAssets ? (
          <>
            <form style={{ width: '100%' }}>
              <TextField.Root
                placeholder="Results bearer token (temporary and required for analysis)"
                value={analysisResultsBearerToken}
                onChange={(event) => {
                  const { value } = event.target
                  setAnalysisResultsBearerToken(value)
                }}
              ></TextField.Root>
            </form>

            <Dialog.Root
              open={isWorkflowModalOpen}
              onOpenChange={setIsWorkflowModalOpen}
            >
              <Dialog.Trigger>
                <Button disabled={isAnalysisRunning}>Analyse Assets</Button>
              </Dialog.Trigger>

              <Dialog.Content maxWidth="500px">
                <WorkflowModalContent
                  handleAnalyseAssets={handleAnalyseAssets}
                />
              </Dialog.Content>
            </Dialog.Root>
          </>
        ) : null}
      </div>
    </div>
  )

  const portfolioWorkflowInfo = (
    <Text as="p">
      Portfolio: {uploadedFileName}
      {currentWorkflowTitle ? <> | Workflow: {currentWorkflowTitle}</> : null}
    </Text>
  )

  return (
    <PageWithMapLayout
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      title="Assets"
      subtitle={
        <>
          <Text weight="bold" as="p">
            Choose an existing portfolio or open a new file for analysis
          </Text>
          {uploadedFileName ? portfolioWorkflowInfo : null}
        </>
      }
      sidebarWidth="900px"
    />
  )
}
