import { Button, Heading, Link, Text, Dialog, Spinner } from '@radix-ui/themes'
import { useContext, useMemo, useState } from 'react'

import {
  RowSelection,
  UserAssets,
} from '../../../library/userAssets/userAssetTypes'
import { analyseAssets } from '../../../library/userAssets/analyseAssets'
import { AssetsPageContext } from '../../../context/AssetsPageContext'
import { AssetsSelect } from '../../AssetsSelect/AssetsSelect'
import { AssetsTable } from '../../AssetsTable/AssetsTable'
import { AuthenticationContext } from '../../../context/AuthenticationContext'
import { convertSimpleGeoJSONToDataForTable } from '../../../library/userAssets/convertUserAssets'
import { HubWorkflowNicknamesType } from '../../../configuration/constants'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Map } from '../../Map/Map'
import { PageSubtitle } from '../../PageSubtitle'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { temporarySamplePortfolios } from '../../../library/api/fakeApiData'
import { toast } from 'react-toastify'
import { UploadButtonAndDialog } from '../../UploadButtonAndDialog/UploadButtonAndDialog'
import { uploadUserAssets } from '../../../library/api/uploadUserAssets'
import { useMap } from '../../Map/useMap'
import { UserAssetsContext } from '../../../context/UserAssetsContext'
import { WorkflowModalContent } from './WorkflowModalContent'
import assetStyles from './Assets.module.scss'
import sidebarStyles from '../../Layout/Sidebar.module.scss'

export const Assets = () => {
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false)
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelection>({})
  const [isFileUploading, setIsFileUploading] = useState(false)

  const {
    authenticatedAxios,
    isAuthenticated,
    login,
    userInfo,
    workspaceUserName,
  } = useContext(AuthenticationContext)
  const {
    persistedMapCenter,
    persistedMapZoom,
    setPersistedMapCenter,
    setPersistedMapZoom,
  } = useContext(AssetsPageContext)

  const { mapContainer, mapRef, isMapLoaded } = useMap({
    center: persistedMapCenter,
    setPersistedMapCenter,
    zoom: persistedMapZoom,
    setPersistedMapZoom,
  })
  const {
    currentWorkflowNickname,
    setAnalysedUserAssets,
    setAnalysisRunDate,
    setCurrentWorkflowNickname,
    setUploadedFileName,
    setUserAssets,
    setWorkflowJobIdAssociatedWithData,
    uploadedFileName,
    userAssets,
  } = useContext(UserAssetsContext)

  const handleLoadAssets = ({
    fileName,
    assets,
  }: {
    fileName: string
    assets: UserAssets
  }) => {
    if (!authenticatedAxios || !workspaceUserName) {
      toast.error('Please log in to upload a file.')
      return
    }
    setIsFileUploading(true)
    uploadUserAssets({
      authenticatedAxios,
      assets,
      fileName,
      workspaceUserName,
    })
      .then(() => {
        setCurrentWorkflowNickname?.(undefined)
        setRowSelection({})
        setUserAssets?.(assets)
        setUploadedFileName?.(fileName)
        toast.success('File uploaded to data hub successfully')
      })
      .catch(() => {
        toast.error('Error uploading file to data hub')
      })
      .finally(() => {
        setIsFileUploading(false)
      })
  }

  const handleAnalyseAssets = ({
    workflowTitle,
  }: {
    workflowTitle: HubWorkflowNicknamesType
  }) => {
    if (!userAssets) {
      throw new Error('handleAnalyseAssets has a missing userAssets parameter')
    }
    if (!uploadedFileName) {
      throw new Error(
        'handleAnalyseAssets has a missing uploadedFileName parameter',
      )
    }
    if (!setAnalysedUserAssets) {
      throw new Error(
        'handleAnalyseAssets has a missing setAnalysedUserAssets parameter',
      )
    }
    if (!setWorkflowJobIdAssociatedWithData) {
      throw new Error(
        'handleAnalyseAssets has a missing setWorkflowJobIdAssociatedWithData parameter',
      )
    }
    if (!userInfo || !authenticatedAxios || !workspaceUserName) {
      toast.error('Please log in to run an analysis.')

      return
    }

    if (!isAuthenticated) {
      void login()
      return
    }
    toast.dismiss()

    toast.success(
      <>
        <strong>Analysis in Progress</strong>
        <br />
        You will receive a notification when it&apos;s ready.
      </>,
    )
    setWorkflowJobIdAssociatedWithData(null)
    setAnalysedUserAssets(null)
    setCurrentWorkflowNickname?.(workflowTitle)
    setIsWorkflowModalOpen(false)
    setIsAnalysisRunning(true)
    analyseAssets({
      axios: authenticatedAxios,
      currentWorkflowNickname: workflowTitle,
      fileName: uploadedFileName,
      workspaceUserName,
    })
      .then(({ analysedData, jobId }) => {
        setWorkflowJobIdAssociatedWithData(jobId)
        setAnalysedUserAssets(analysedData)
        setAnalysisRunDate?.(
          ` ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        )

        // eslint-disable-next-line no-console
        console.log('Risk analysis results:', analysedData)
        toast.dismiss()
        toast.success(
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

            <Button asChild variant="surface">
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

  const userAssetsForTable = useMemo(
    () => convertSimpleGeoJSONToDataForTable(userAssets),
    [userAssets],
  )

  const usePortfolioData = (id: string) => {
    const selectedPortfolio = temporarySamplePortfolios.find(
      (portfolio) => portfolio.id === id,
    )

    if (selectedPortfolio) {
      setCurrentWorkflowNickname?.(undefined)
      setUploadedFileName?.(selectedPortfolio.fileName)
      setUserAssets?.(selectedPortfolio.data as UserAssets)
    }
  }

  const uploadButton = (
    <Link asChild>
      <button className={assetStyles.openFileButton} disabled={isFileUploading}>
        {isFileUploading ? <Spinner /> : <>+</>} Open File
      </button>
    </Link>
  )

  const sidebarContent = (
    <div className={sidebarStyles.content}>
      <div className={assetStyles.sidebarTopSection}>
        <div className={assetStyles.selectPortfolioRow}>
          <div className={assetStyles.assetsSelectWrapper}>
            <label>Portfolios</label>
            <AssetsSelect onValueChange={usePortfolioData} />
          </div>
          <UploadButtonAndDialog
            onLoadAssets={handleLoadAssets}
            trigger={uploadButton}
            description="Select a file for analysis"
          />
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
        {userAssets ? (
          <AssetsTable
            isMapLoaded={isMapLoaded}
            mapRef={mapRef}
            userAssetsForTable={userAssetsForTable}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        ) : null}
      </div>

      <div className={assetStyles.analyseButtonRow}>
        {userAssets ? (
          <Dialog.Root
            open={isWorkflowModalOpen}
            onOpenChange={setIsWorkflowModalOpen}
          >
            <Dialog.Trigger>
              <Button disabled={isAnalysisRunning}>Analyse Assets</Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="500px">
              <WorkflowModalContent handleAnalyseAssets={handleAnalyseAssets} />
            </Dialog.Content>
          </Dialog.Root>
        ) : null}
      </div>
    </div>
  )

  const portfolioWorkflowInfo = (
    <Text as="p">
      Portfolio: {uploadedFileName}
      {currentWorkflowNickname ? (
        <> | Workflow: {currentWorkflowNickname}</>
      ) : null}
    </Text>
  )

  return (
    <PageWithMapLayout
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      title="Assets"
      subtitle={
        <>
          <PageSubtitle>
            Choose an existing portfolio or open a new file for analysis
          </PageSubtitle>
          {uploadedFileName ? portfolioWorkflowInfo : null}
        </>
      }
      sidebarWidth="900px"
    />
  )
}
