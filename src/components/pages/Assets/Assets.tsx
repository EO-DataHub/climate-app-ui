import axios from 'axios'
import { Button, Heading, Link, TextField } from '@radix-ui/themes'
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
import containerStyles from '../../../library/genericStyles/containers.module.scss'
import sidebarStyles from '../../Layout/Sidebar.module.scss'

export const Assets = () => {
  const [analysisResultsBearerToken, setAnalysisResultsBearerToken] =
    useState('') // temporary until we have better IAM
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelection>({})
  const { isAuthenticated, login } = useContext(AuthenticationContext)
  const { mapContainer, mapRef, isMapLoaded } = useMap()
  const { setAnalysedUserAssets, setUserAssets, userAssets } =
    useContext(UserAssetsContext)

  const handleLoadAssets = (parsedAssets: UserAssets) => {
    setRowSelection({})
    setUserAssets?.(parsedAssets)
  }

  const handleAnalyseAssets = () => {
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
        toast(
          <div className={containerStyles.flexRowSpaceBetweenCenter}>
            <div>Analysis complete</div>
            <Button asChild>
              <ReactRouterLink to="/analytics">View Results</ReactRouterLink>
            </Button>
          </div>,
        )
      })
      .catch(() => {
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
            <Button onClick={handleAnalyseAssets} disabled={isAnalysisRunning}>
              Analyse Assets
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )

  return (
    <PageWithMapLayout
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      title="Assets"
      subtitle="Choose an existing portfolio or open a new file for analysis"
      sidebarWidth="900px"
    />
  )
}
