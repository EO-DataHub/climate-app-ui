import { Button, Select, Tabs, Text } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AssetsSelect } from '../../AssetsSelect/AssetsSelect'
import { InputLabelContainer } from '../../Form/InputLabelContainer'
import { Map } from '../../Map/Map'
import { ObservationsMenu } from './ObservationsMenu'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { useAssetPortfolios } from '../../../library/userAssets/useAssetPortfolios'
import { useMap } from '../../Map/useMap'
import formStyles from '../../../library/genericStyles/forms.module.scss'
import sidebarStyles from '../../Layout/Sidebar.module.scss'
import {
  observationDatePopupContent,
  observationTypePopupContent,
} from '../../../configuration/infoPopupContentObservations'
import { InfoPopover } from '../../InfoPopover/InfoPopover'
import { useGetObservationValueByMapclick } from './useGetObservationValueByMapClick'
import { LocationValueOverview } from '../../LocationValueOverview/LocationValueOverview'

export const Observations = () => {
  const [selectedObservationLayerUrl, setSelectedObservationLayerUrl] =
    useState('')

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

  const min_temp = 10
  const max_temp = 45

  const { markerCoordinates, observationMarkerValue, isMarkerOnMap } =
    useGetObservationValueByMapclick({
      isMapLoaded,
      mapRef,
      selectedObservationLayerUrl,
    })

  useEffect(
    function hackAddATempLayerForDemo() {
      if (!isMapLoaded || !mapRef.current) {
        return
      }

      if (mapRef.current.getLayer('observation-layer')) {
        mapRef.current.removeLayer('observation-layer')
        mapRef.current.removeSource('observation-layer')
      }

      const titilerUrl = `https://titiler.xyz/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.png?url=${selectedObservationLayerUrl}&rescale=${min_temp},${max_temp}&colormap_name=jet`

      mapRef.current.addSource('observation-layer', {
        type: 'raster',
        tiles: [titilerUrl],
        tileSize: 256,
        bounds: [-1.38, 50.53, 2.25, 52.82], //[-154288, 6540200, 249532, 6948850],
      })

      mapRef.current.addLayer({
        id: 'observation-layer',
        type: 'raster',
        source: 'observation-layer',
        paint: { 'raster-opacity': 0.9 },
      })
    },
    [isMapLoaded, mapRef, selectedObservationLayerUrl],
  )

  const sidebarContent = (
    <div className={sidebarStyles.content}>
      <div className={sidebarStyles.contentMidSection}>
        <form className={sidebarStyles.contentForm}>
          <InputLabelContainer>
            <div className={formStyles.labelWithInfoPopoverRow}>
              <label htmlFor="observation-type">Observation Type</label>
              <InfoPopover>{observationTypePopupContent}</InfoPopover>
            </div>

            <Select.Root>
              <Select.Trigger placeholder="Select" />
              <Select.Content id="observation-type">
                <Select.Item value="x">
                  Land Surface Temperature (London 100m resolution)
                </Select.Item>
              </Select.Content>
            </Select.Root>
          </InputLabelContainer>
          <InputLabelContainer>
            <div className={formStyles.labelWithInfoPopoverRow}>
              <label htmlFor="observation-date">Date</label>
              <InfoPopover>{observationDatePopupContent}</InfoPopover>
            </div>
            <ObservationsMenu
              selectedObservationLayerUrl={selectedObservationLayerUrl}
              setSelectedObservationLayerUrl={setSelectedObservationLayerUrl}
            />
          </InputLabelContainer>
        </form>
        <Tabs.Root defaultValue="overview" className={sidebarStyles.tabsRoot}>
          <Tabs.List>
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="Methodology">Methodology</Tabs.Trigger>
          </Tabs.List>
          <div className={sidebarStyles.tabsContentWrapper}>
            <Tabs.Content value="overview">
              <LocationValueOverview
                isMarkerOnMap={isMarkerOnMap}
                layerLabel={''}
                locationValue={
                  observationMarkerValue === null
                    ? null
                    : observationMarkerValue === 'Unknown'
                      ? 'Unknown'
                      : `${observationMarkerValue} °C`
                }
                markerCoordinates={markerCoordinates}
              />
            </Tabs.Content>

            <Tabs.Content value="Methodology">
              <Text size="3">
                <p>
                  Land Surface Temperature means radiative temperature of the
                  outermost “skin” layer of a given surface. It is related to
                  blackbody radiation at a given temperature, modified by
                  spectral emissivity component.
                </p>
                <p>
                  <strong>Credit</strong>: University of Leicester, Surface
                  Temperature Group, NCEO
                </p>
                <p>
                  <strong>Citation</strong>: Perry, M. J. S, Remedios, J. J,
                  Ghent, D, Veal, K. L, Göttsche, F, A new inverse method for
                  the retrieval of Land Surface Temperature and Emissivity from
                  the ASTER instrument, AGU Earth and Space Science, (in review
                  2024)
                </p>
              </Text>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>

      <div className={sidebarStyles.contentBottomButtonRow}>
        <div className={sidebarStyles.selectAssetsWrapper}>
          <label>View Assets on Map</label>
          <InputLabelContainer>
            <AssetsSelect
              showUnsaved
              onValueChange={updateCurrentPortfolioShown}
            />
          </InputLabelContainer>
        </div>
        <div className={sidebarStyles.selectAssetsButtonWrapper}>
          <Button onClick={handleSelectAssetsClick}>
            Select Assets for Analysis
          </Button>
        </div>
      </div>
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
      sidebarWidth="40%"
      legend={legend}
    />
  )
}
