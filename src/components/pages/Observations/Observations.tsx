import { Button, Select, Separator, Text } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAssetPortfolios } from '../../../library/userAssets/useAssetPortfolios'
import { AssetsSelect } from '../../AssetsSelect/AssetsSelect'
import { InputLabelContainer } from '../../Form/InputLabelContainer'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { Map } from '../../Map/Map'
import { useMap } from '../../Map/useMap'
import { ObservationsMenu } from '../../ObservationsMenu/ObservationsMenu'
import observationsStyles from './Observations.module.scss'

export const Observations = () => {
  interface ClickInfoState {
    lat: number | null
    lon: number | null
    value: number | null // Allow value to be number or null
  }

  const [selected, setSelected] = useState('')

  // Use the type with useState
  const [clickInfo, setClickInfo] = useState<ClickInfoState>({
    lat: null,
    lon: null,
    value: null,
  })

  const { mapContainer, mapRef, isMapLoaded } = useMap({
    center: [0, 51.5],
    zoom: 7,
  })
  const { updateCurrentPortfolioShown } = useAssetPortfolios({
    mapRef,
    isMapLoaded,
  })
  const navigate = useNavigate()

  const handleSelectAssetsClick = () => {
    navigate('/assets')
  }

  const min_temp = 22
  const max_temp = 47

  useEffect(
    function hackAddATempLayerForDemo() {
      if (!isMapLoaded || !mapRef.current) {
        return
      }

      if (mapRef.current.getLayer(selected)) {
        mapRef.current.removeLayer(selected)
        mapRef.current.removeSource(selected)
      }

      const titilerUrl = `https://titiler.xyz/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.png?url=${selected}&rescale=${min_temp},${max_temp}&colormap_name=jet`

      mapRef.current.addSource(selected, {
        type: 'raster',
        tiles: [titilerUrl],
        tileSize: 256,
        bounds: [-1.38, 50.53, 2.25, 52.82], //[-154288, 6540200, 249532, 6948850],
      })

      mapRef.current.addLayer({
        id: selected,
        type: 'raster',
        source: selected,
        paint: { 'raster-opacity': 0.9 },
      })

      // Add click event listener
      mapRef.current.on('click', (e) => {
        const lon = e.lngLat.lng
        const lat = e.lngLat.lat
        const queryUrl = `https://titiler.xyz/cog/point/${lon},${lat}?url=${selected}`
        // Fetch the data from the queryUrl
        fetch(queryUrl)
          .then((response) => {
            if (response.status === 500) {
              throw new Error('Server error: 500')
            }
            return response.json()
          })
          .then((data) => {
            const temp = parseFloat(data.values)
            if (temp !== -3.4028234663852886e38) {
              setClickInfo({ lat, lon, value: temp })
            }
          })
          .catch(() => {
            setClickInfo({ lat, lon, value: null })
          })
      })
    },
    [isMapLoaded, mapRef, selected],
  )

  const observationLocationInfo = (
    <div className={observationsStyles.locationInfoWrapper}>
      <h3>Location</h3>
      <p style={{ fontSize: '16px', fontWeight: '500' }}>
        {clickInfo?.lat?.toFixed(4) ?? 'N/A'}°,{' '}
        {clickInfo?.lon?.toFixed(4) ?? 'N/A'}°
      </p>
      <p>Temperature {clickInfo.value?.toFixed(2) ?? 'N/A'}°C</p>
    </div>
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
            <ObservationsMenu selected={selected} setSelected={setSelected} />
          </InputLabelContainer>
        </form>
        <Text size="3">
          <p>
            Land Surface Temperature means radiative temperature of the
            outermost “skin” layer of a given surface. It is related to
            blackbody radiation at a given temperature, modified by spectral
            emissivity component.
          </p>
          <p>
            <strong>Credit</strong>: University of Leicester, Surface
            Temperature Group, NCEO
          </p>
          <p>
            <strong>Citation</strong>: Perry, M. J. S, Remedios, J. J, Ghent, D,
            Veal, K. L, Göttsche, F, A new inverse method for the retrieval of
            Land Surface Temperature and Emissivity from the ASTER instrument,
            AGU Earth and Space Science, (in review 2024)
          </p>
        </Text>
        {clickInfo.lat &&
          clickInfo.lon &&
          clickInfo.value !== null &&
          observationLocationInfo}

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

  const legend = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: `12px`,
      }}
    >
      <div style={{ width: '100%', textAlign: 'left', marginBottom: '5px' }}>
        Degrees Celsius
      </div>
      <img
        src="https://titiler.xyz/colorMaps/jet?format=png"
        alt="Color Map Legend"
        style={{ width: '100%', height: 'auto' }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <span>{min_temp}</span>
        <span>{max_temp}</span>
      </div>
    </div>
  )

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
