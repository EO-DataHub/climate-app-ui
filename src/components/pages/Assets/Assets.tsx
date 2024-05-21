import { Button } from '@radix-ui/themes'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { AssetsSelect } from '../../AssetsSelect'
import { Map } from '../../Map/Map'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { UploadButtonAndDialog } from '../../UploadButtonAndDialog/UploadButtonAndDialog'
import { useMap } from '../../Map/useMap'
import { UserAssetsContext } from '../../../context/UserAssetsContext'
import assetStyles from './Assets.module.scss'
import containerStyles from '../../../library/genericStyles/containers.module.scss'

export const Assets = () => {
  const { mapContainer, mapRef } = useMap()
  const { userAssets } = useContext(UserAssetsContext)
  const navigate = useNavigate()

  const sidebarContent = (
    <div className={assetStyles.sidebarContent}>
      <div className={containerStyles.flexRowStartCenter}>
        <AssetsSelect />
        <UploadButtonAndDialog mapRef={mapRef} />
      </div>
      <div className={assetStyles.analyseButtonRow}>
        {userAssets ? (
          <Button
            onClick={() => {
              navigate('/analyse-assets')
            }}
          >
            Analyse Assets
          </Button>
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
    />
  )
}
