import { Button, Heading, Select, Separator, Text } from '@radix-ui/themes'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// @ts-expect-error - no types for this library
import proj4 from 'proj4'

import { AssetsSelect } from '../../AssetsSelect/AssetsSelect'
import { InputLabelContainer } from '../../Form/InputLabelContainer'
import { Map } from '../../Map/Map'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { useAssetPortfolios } from '../../../library/userAssets/useAssetPortfolios'
import { useMap } from '../../Map/useMap'
import observationsStyles from './Observations.module.scss'

export const Observations = () => {
  const { mapContainer, mapRef, isMapLoaded } = useMap()
  const { updateCurrentPortfolioShown } = useAssetPortfolios({
    mapRef,
    isMapLoaded,
  })
  const navigate = useNavigate()

  const handleSelectAssetsClick = () => {
    navigate('/assets')
  }

  useEffect(
    function hackAddATempLayerForDemo() {
      if (!isMapLoaded || !mapRef.current) return

      const minX = -311137.9892962570302188
      const minY = 6540149.9521725047379732
      const maxX = 249578.2873153906257357
      const maxY = 6948850.7707961332052946

      const rasterNorthWest = proj4('EPSG:3857', 'EPSG:4326', [minX, maxY])
      const rasterNorthEast = proj4('EPSG:3857', 'EPSG:4326', [maxX, maxY])
      const rasterSouthEast = proj4('EPSG:3857', 'EPSG:4326', [maxX, minY])
      const rasterSouthWest = proj4('EPSG:3857', 'EPSG:4326', [minX, minY])

      const tileUrl = `https://dev.eodatahub.org.uk/vs/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=${minX},${minY},${maxX},${maxY}&CRS=EPSG:3857&WIDTH=1587&HEIGHT=388&LAYERS=LST_COLLECTION__LST_VISUALIZATION&STYLES=&FORMAT=image/png&DPI=96&MAP_RESOLUTION=96&FORMAT_OPTIONS=dpi:96&TRANSPARENT=TRUE&styles=rainbow`

      mapRef.current.addSource('demo', {
        type: 'image',
        url: tileUrl,
        coordinates: [
          rasterNorthWest,
          rasterNorthEast,
          rasterSouthEast,
          rasterSouthWest,
        ],
      })

      mapRef.current.addLayer({
        id: 'demo',
        type: 'raster',
        source: 'demo',
        paint: { 'raster-opacity': 0.9 },
      })
    },
    [isMapLoaded, mapRef],
  )

  const sidebarContent = (
    <div className={observationsStyles.sidebarContent}>
      <div className={observationsStyles.sidepanelMidSection}>
        <form className={observationsStyles.observationsForm}>
          <InputLabelContainer>
            <label htmlFor="filter-1">Filter 1</label>
            <Select.Root>
              <Select.Trigger placeholder="Select" />
              <Select.Content id="filter-1">
                <Select.Item value="x">Value 1</Select.Item>
                <Select.Item value="y">Value 2</Select.Item>
                <Select.Item value="z">Value 3</Select.Item>
              </Select.Content>
            </Select.Root>
          </InputLabelContainer>
          <InputLabelContainer>
            <label htmlFor="filter-2">Filter 2</label>
            <Select.Root>
              <Select.Trigger placeholder="Select" />
              <Select.Content id="filter-2">
                <Select.Item value="x">Value 1</Select.Item>
                <Select.Item value="y">Value 2</Select.Item>
                <Select.Item value="z">Value 3</Select.Item>
              </Select.Content>
            </Select.Root>
          </InputLabelContainer>

          <div className={observationsStyles.multiInputRow}>
            <InputLabelContainer>
              <label htmlFor="filter-3">Filter 3</label>
              <Select.Root>
                <Select.Trigger placeholder="Select" />
                <Select.Content id="filter-3">
                  <Select.Item value="x">Value 1</Select.Item>
                  <Select.Item value="y">Value 2</Select.Item>
                  <Select.Item value="z">Value 3</Select.Item>
                </Select.Content>
              </Select.Root>
            </InputLabelContainer>
            <InputLabelContainer>
              <label htmlFor="filter-4">Filter 4</label>
              <Select.Root>
                <Select.Trigger placeholder="Select" />
                <Select.Content id="filter-4">
                  <Select.Item value="x">Value 1</Select.Item>
                  <Select.Item value="y">Value 2</Select.Item>
                  <Select.Item value="z">Value 3</Select.Item>
                </Select.Content>
              </Select.Root>
            </InputLabelContainer>
            <InputLabelContainer>
              <label htmlFor="filter-5">Filter 5</label>
              <Select.Root>
                <Select.Trigger placeholder="Select" />
                <Select.Content id="filter-5">
                  <Select.Item value="x">Value 1</Select.Item>
                  <Select.Item value="y">Value 2</Select.Item>
                  <Select.Item value="z">Value 3</Select.Item>
                </Select.Content>
              </Select.Root>
            </InputLabelContainer>
          </div>
        </form>
        <Separator size="4" />
        <div className={observationsStyles.portfolioSelectWrapper}>
          <Text size="3" weight="bold">
            View Assets on Map
          </Text>
          <InputLabelContainer>
            <AssetsSelect
              showUnsaved
              onValueChange={updateCurrentPortfolioShown}
            />
          </InputLabelContainer>
        </div>
        <div style={{ width: '100%' }}>
          <Heading as="h2" size="5">
            Heading Here
          </Heading>
          <Text size="3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
          <div className={observationsStyles.greyBox}></div>
        </div>
      </div>

      <Button
        className={observationsStyles.selectAssetsButton}
        onClick={handleSelectAssetsClick}
      >
        Select Assets for Analysis
      </Button>
    </div>
  )

  const legend = <>Legend Placeholder</>

  return (
    <PageWithMapLayout
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      title="Observations"
      subtitle="Lorem ipsum dolor sit amet, consectetur elit."
      sidebarWidth="542px"
      legend={legend}
    />
  )
}
