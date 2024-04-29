import { Button, Select, Spinner, Text } from '@radix-ui/themes'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { PageWithMapLayout } from '../Layout/PageWithMapLayout'
import { Map } from '../Map/Map'
import { useMap } from '../Map/useMap'
import { UserAssetsContext } from '../../context/UserAssetsContext'
import containerStyles from '../genericStyles/containers.module.css'
import { RasterTileSource } from 'maplibre-gl'

enum MapSourceIds {
  HAZARD_DATA = 'hazard-data',
}

export const Assets = () => {
  const [isHazardDataLoading, setIsHazardDataLoading] = useState(false)
  const { loadUserAssets } = useContext(UserAssetsContext)
  const { mapContainer, mapRef } = useMap()
  const uploadRef = useRef<HTMLInputElement>(null)

  const setHazardData = useCallback(() => {
    if (!mapRef.current) return

    setIsHazardDataLoading(true)
    mapRef.current.on('idle', () => setIsHazardDataLoading(false))

    const hazardSource = mapRef.current.getSource(
      MapSourceIds.HAZARD_DATA,
    ) as RasterTileSource

    const tileUrlToUse =
      'https://i0h9crgku9.execute-api.us-west-2.amazonaws.com/tiles/WebMercatorQuad/{z}/{x}/{y}@1x?url=s3://ukri-eodh-hazard-tiles-test/hazard-test-titiler-xarray/hazard.zarr/chronic_heat/osc/v2/days_tas_above_20c_NorESM2-MM_ssp585_2090-xarray&variable=data&rescale=0%2C200&colormap_name=viridis&maxzoom10='

    if (!hazardSource) {
      mapRef.current.addSource(MapSourceIds.HAZARD_DATA, {
        type: 'raster',
        tiles: [tileUrlToUse],
      })
    }

    if (hazardSource) {
      hazardSource.setTiles([tileUrlToUse])
    }

    const hazardLayer = mapRef.current.getLayer(MapSourceIds.HAZARD_DATA)
    if (!hazardLayer) {
      mapRef.current.addLayer({
        id: MapSourceIds.HAZARD_DATA,
        type: 'raster',
        source: MapSourceIds.HAZARD_DATA,
      })
    }
  }, [mapRef])

  const sidebarContent = (
    <>
      <Text>A hypothetical side bar</Text>
      <input
        type="file"
        id="upload-assets"
        hidden
        ref={uploadRef}
        onChange={(event) => loadUserAssets?.(event)}
        accept=".csv, .geojson"
      />
      <Button onClick={() => uploadRef.current?.click()}>
        Upload GeoJSON or CSV Assets (proof of concept)
      </Button>

      <div className={containerStyles.flexRowStartCenter}>
        <label htmlFor="hazard-type">Hazard Type</label>
        <Select.Root defaultValue="x">
          <Select.Trigger placeholder="Select" />
          <Select.Content id="hazard-type">
            <Select.Item value="x">Chronic Heat</Select.Item>
          </Select.Content>
        </Select.Root>
        <label htmlFor="hazard-indicator">Hazard Indicator</label>
        <Select.Root defaultValue="x">
          <Select.Trigger placeholder="Select" />
          <Select.Content id="hazard-indicator">
            <Select.Item value="x">
              Maximum temperature will be above 20 degrees celcius
            </Select.Item>
          </Select.Content>
        </Select.Root>
        <label htmlFor="scenario">Scenario</label>
        <Select.Root defaultValue="x">
          <Select.Trigger placeholder="Select" />
          <Select.Content id="scenario">
            <Select.Item value="x">SSP585</Select.Item>
          </Select.Content>
        </Select.Root>
        <label htmlFor="year">Year</label>
        <Select.Root defaultValue="x">
          <Select.Trigger placeholder="Select" />
          <Select.Content id="year">
            <Select.Item value="x">2090</Select.Item>
          </Select.Content>
        </Select.Root>
        {isHazardDataLoading ? <Spinner /> : null}
      </div>
    </>
  )

  useEffect(
    function foo() {
      const mapInstance = mapRef.current
      if (!mapInstance) return

      mapInstance.on('load', setHazardData)

      return () => {
        mapInstance.off('load', setHazardData)
      }
    },
    [setHazardData, mapRef],
  )

  return (
    <PageWithMapLayout
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      pageName="Assets"
    />
  )
}
