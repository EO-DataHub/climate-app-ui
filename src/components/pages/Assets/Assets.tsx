import { Text } from '@radix-ui/themes'

import { Map } from '../../Map/Map'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { UploadButtonAndDialog } from '../../UploadButtonAndDialog/UploadButtonAndDialog'
import { useMap } from '../../Map/useMap'
import containerStyles from '../../../library/genericStyles/containers.module.scss'
import { AssetsSelect } from '../../AssetsSelect'

export const Assets = () => {
  const { mapContainer, mapRef } = useMap()

  const sidebarContent = (
    <>
      <Text>
        Choose an existing portfolio or upload a new file for analysis
      </Text>

      <div className={containerStyles.flexRowStartCenter}>
        <AssetsSelect />
        <UploadButtonAndDialog mapRef={mapRef} />
      </div>
    </>
  )

  return (
    <PageWithMapLayout
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      title="Assets"
    />
  )
}
