import { Button, Select, Spinner, Text } from '@radix-ui/themes'
import { RasterTileSource } from 'maplibre-gl'
import { VegaLite, VisualizationSpec } from 'react-vega'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { Map } from '../Map/Map'
import { PageWithMapLayout } from '../Layout/PageWithMapLayout'
import { useMap } from '../Map/useMap'
import { UserAssetsContext } from '../../context/UserAssetsContext'
import containerStyles from '../genericStyles/containers.module.css'

enum MapSourceIds {
  HAZARD_DATA = 'hazard-data',
}

export const Assets = () => {
  const [areHazardTilesLoading, setAreHazardTilesLoading] = useState(false)
  const { loadUserAssets } = useContext(UserAssetsContext)
  const { mapContainer, mapRef } = useMap()
  const uploadRef = useRef<HTMLInputElement>(null)

  const {
    // isPending: isAssetHazardDataLoading,
    // error: assetHazardDataError,
    data: assetHazardData,
  } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      axios.get('http://54.170.128.128:8000/mock').then((res) => {
        console.log('HERE')
        const sampleAssetHazardData = res.data[3]
        const twenty30 = sampleAssetHazardData['2030']
        const twenty40 = sampleAssetHazardData['2040']
        const twenty50 = sampleAssetHazardData['2050']
        const formattedData = [
          {
            category: 2030,
            scenario: 'SPP126',
            value: twenty30?.ssp126.ChronicHeat,
          },
          {
            category: 2030,
            scenario: 'SPP245',
            value: twenty30?.ssp245.ChronicHeat,
          },
          {
            category: 2030,
            scenario: 'SPP585',
            value: twenty30?.ssp585.ChronicHeat,
          },
          {
            category: 2040,
            scenario: 'SPP126',
            value: twenty40?.ssp126.ChronicHeat,
          },
          {
            category: 2040,
            scenario: 'SPP245',
            value: twenty40?.ssp245.ChronicHeat,
          },
          {
            category: 2040,
            scenario: 'SPP585',
            value: twenty40?.ssp585.ChronicHeat,
          },
          {
            category: 2050,
            scenario: 'SPP126',
            value: twenty50?.ssp126.ChronicHeat,
          },
          {
            category: 2050,
            scenario: 'SPP245',
            value: twenty50?.ssp245.ChronicHeat,
          },
          {
            category: 2050,
            scenario: 'SPP585',
            value: twenty50?.ssp585.ChronicHeat,
          },
        ]
        console.log('foo', formattedData)

        return formattedData
      }),
  })

  const updateHazardMapTiles = useCallback(() => {
    if (!mapRef.current) return

    setAreHazardTilesLoading(true)
    mapRef.current.on('idle', () => setAreHazardTilesLoading(false))

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

  const data1 = {
    myData: assetHazardData,
  }

  const spec1: VisualizationSpec = {
    data: { name: 'myData' },
    title: {
      text: 'A Simple Bar Chart',
      anchor: 'start',
      fontSize: 20,
    },
    description: 'A simple bar chart with embedded data.',
    width: 'container',
    height: 400,
    encoding: {
      x: { field: 'category', axis: { labelAngle: 0, labelFontSize: 13 } },
      y: {
        field: 'value',
        type: 'quantitative',
        // axis: { tickMinStep: 0.5 }
      },
      xOffset: { field: 'scenario' },
      color: { field: 'scenario', scale: { range: ['red', 'green', 'blue'] } },
    },
    mark: 'bar',
  }

  const sidebarContent = (
    <>
      foo:{JSON.stringify(assetHazardData)}
      <Text>Internal &apos;technically works&apos; demo (not a UX demo)</Text>
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
        {areHazardTilesLoading ? <Spinner /> : null}
      </div>
      <VegaLite data={data1} spec={spec1} />
    </>
  )

  useEffect(
    function foo() {
      const mapInstance = mapRef.current
      if (!mapInstance) return

      mapInstance.on('load', updateHazardMapTiles)

      return () => {
        mapInstance.off('load', updateHazardMapTiles)
      }
    },
    [updateHazardMapTiles, mapRef],
  )

  return (
    <PageWithMapLayout
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      pageName="Assets"
    />
  )
}
