import { Button, Select, Separator, Text } from '@radix-ui/themes'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAssetPortfolios } from '../../../library/userAssets/useAssetPortfolios'
import { AssetsSelect } from '../../AssetsSelect/AssetsSelect'
import { InputLabelContainer } from '../../Form/InputLabelContainer'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { Map } from '../../Map/Map'
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

      //const tileUrl = `https://test.eodatahub.org.uk/vs/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX={bbox-epsg-3857}&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=LST_COLLECTION__LST_VISUALIZATION&STYLES=&FORMAT=image/png&DPI=72&MAP_RESOLUTION=72&FORMAT_OPTIONS=dpi:72&TRANSPARENT=TRUE&styles=rainbow`

      //const wmtsTemplateUrl = "https://test.eodatahub.org.uk/vs/cache/ows/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=LST_COLLECTION__LST_VISUALIZATION&STYLE=default&FORMAT=image%2Fjpgpng&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&time=2024-06-18T13%3A22%3A03Z%2F2024-07-08T12%3A40%3A47Z&TILEROW={y}&TILECOL={x}"

      const titilerUrl =
        'https://titiler.xyz/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.png?url=https://ukri-eodh-hazard-tiles-sg2.s3.eu-west-1.amazonaws.com/centigrade.tif&rescale=22%2C49&colormap_name=jet'

      mapRef.current.addSource('demo', {
        type: 'raster',
        tiles: [titilerUrl],
        tileSize: 256,
        //bounds: [-1.38, 50.53, 2.25, 52.82], //[-154288, 6540200, 249532, 6948850],
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
            <label htmlFor="filter-1">Observation Type</label>
            <Select.Root>
              <Select.Trigger placeholder="Select" />
              <Select.Content id="filter-1">
                <Select.Item value="x">Land Surface Temperature</Select.Item>
                <Select.Item value="y">Flooding</Select.Item>
              </Select.Content>
            </Select.Root>
          </InputLabelContainer>
          <InputLabelContainer>
            <label htmlFor="filter-2">Date</label>
            <Select.Root>
              <Select.Trigger placeholder="Select" />
              <Select.Content id="filter-2">
                <Select.Item value="x">10th July 2022</Select.Item>
                <Select.Item value="y">15th June 2022</Select.Item>
                <Select.Item value="z">11th August 2022</Select.Item>
              </Select.Content>
            </Select.Root>
          </InputLabelContainer>
        </form>
        <Text size="3">
          <strong>Credit</strong>: University of Leicester, Surface Temperature
          Group, NCEO
          <br />
          <strong>Citation</strong>: Perry, M. J. S, Remedios, J. J, Ghent, D,
          Veal, K. L, Göttsche, F, A new inverse method for the retrieval of
          Land Surface Temperature and Emissivity from the ASTER instrument, AGU
          Earth and Space Science, (in review 2024)
        </Text>
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
      subtitle="Earth Observation Data can be used to provide additional insight into local variation in asset risk."
      sidebarWidth="542px"
      legend={legend}
    />
  )
}
