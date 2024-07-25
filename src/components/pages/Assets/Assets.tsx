import axios from 'axios'
import { Button, TextField } from '@radix-ui/themes'
import { useContext, useState } from 'react'

import { analyseAssets } from '../../../library/userAssets/analyseAssets'
import { AssetsSelect } from '../../AssetsSelect/AssetsSelect'
import { Map } from '../../Map/Map'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { UploadButtonAndDialog } from '../../UploadButtonAndDialog/UploadButtonAndDialog'
import { useMap } from '../../Map/useMap'
import {
  RowSelection,
  UserAssets,
} from '../../../library/userAssets/userAssetTypes'
import { UserAssetsContext } from '../../../context/UserAssetsContext'
import assetStyles from './Assets.module.scss'
import containerStyles from '../../../library/genericStyles/containers.module.scss'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { AuthenticationContext } from '../../../context/AuthenticationContext'
import { AssetsTable } from '../../AssetsTable/AssetsTable'

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
              <Link to="/analytics">View Results</Link>
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
    <div className={assetStyles.sidebarContent}>
      <div className={assetStyles.sidebarTopSection}>
        <div className={assetStyles.selectPortfolioRow}>
          <AssetsSelect />
          <UploadButtonAndDialog onLoadAssets={handleLoadAssets} />
        </div>
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
