import { Select, Text } from '@radix-ui/themes'

import { Map } from '../../Map/Map'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { UploadButtonAndDialog } from '../../UploadButtonAndDialog/UploadButtonAndDialog'
import { useMap } from '../../Map/useMap'
import containerStyles from '../../genericStyles/containers.module.css'

export const Assets = () => {
  const { mapContainer, mapRef } = useMap()

  const sidebarContent = (
    <>
      <Text>
        Choose an existing portfolio or upload a new file for analysis
      </Text>

      <div className={containerStyles.flexRowStartCenter}>
        <Select.Root>
          <Select.Trigger placeholder="Select Portfolio" />
          <Select.Content position="popper">
            <Select.Group>
              <Select.Label>Saved Portfolios</Select.Label>
              <Select.Item value="#" disabled>
                demo placeholder
              </Select.Item>
              <Select.Item value="#" disabled>
                demo placeholder
              </Select.Item>
              <Select.Item value="#" disabled>
                demo placeholder
              </Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.Label>Sample Portfolios</Select.Label>
              <Select.Item value="#" disabled>
                demo placeholder
              </Select.Item>
              <Select.Item value="#" disabled>
                demo placeholder
              </Select.Item>
              <Select.Item value="#" disabled>
                demo placeholder
              </Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
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
