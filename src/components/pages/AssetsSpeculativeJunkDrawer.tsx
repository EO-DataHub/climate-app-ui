import { Button, Select, Spinner, Text } from '@radix-ui/themes'
import { RasterTileSource } from 'maplibre-gl'
import { VegaLite, VisualizationSpec } from 'react-vega'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PageSizeSelector } from '../Pagination/PageSizeSelector/PageSizeSelector'
import { PageSelector } from '../Pagination/PageSelector/PageSelector'

import { Map } from '../Map/Map'
import { PageWithMapLayout } from '../Layout/PageWithMapLayout'
import { useMap } from '../Map/useMap'
import containerStyles from '../../library/genericStyles/containers.module.scss'
import {
  AssetRisk,
  fake5000TableAssets,
} from '../../localAssets/fakeAssetTableData'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

const EDOH_BASE_URL = import.meta.env.VITE_EODH_BASE_URL

enum MapSourceIds {
  HAZARD_DATA = 'hazard-data',
}

const columnHelper = createColumnHelper<AssetRisk>()

const columns = [
  columnHelper.accessor('id', {
    header: 'asset id',
  }),
  columnHelper.group({
    header: '2030',
    columns: [
      columnHelper.accessor('2030_ssp126_chronicheat', {
        header: 'SSP126',
      }),
      columnHelper.accessor('2030_ssp245_chronicheat', {
        header: 'SSP245',
      }),
      columnHelper.accessor('2030_ssp585_chronicheat', {
        header: 'SSP585',
      }),
    ],
  }),
  columnHelper.group({
    header: '2040',
    columns: [
      columnHelper.accessor('2040_ssp126_chronicheat', { header: 'SSP126' }),
      columnHelper.accessor('2040_ssp245_chronicheat', { header: 'SSP245' }),
      columnHelper.accessor('2040_ssp585_chronicheat', { header: 'SSP585' }),
    ],
  }),
  columnHelper.group({
    header: '2050',
    columns: [
      columnHelper.accessor('2040_ssp126_chronicheat', { header: 'SSP126' }),
      columnHelper.accessor('2040_ssp245_chronicheat', { header: 'SSP245' }),
      columnHelper.accessor('2040_ssp585_chronicheat', { header: 'SSP585' }),
    ],
  }),
]

export const AssetsSpeculativeJunkDrawer = () => {
  const [areHazardTilesLoading, setAreHazardTilesLoading] = useState(false)
  // const { loadUserAssets } = useContext(UserAssetsContext)
  const { mapContainer, mapRef } = useMap()
  const uploadRef = useRef<HTMLInputElement>(null)
  const [tableData] = useState(() => [...fake5000TableAssets])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  })

  const {
    isPending: isAssetHazardDataLoading,
    error: assetHazardDataError,
    data: assetHazardData,
  } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      axios.get(`${EDOH_BASE_URL}/mock`).then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return res.data
      }),
  })

  const sampleAssetHazardDataForVegaLite = assetHazardData?.[3]
  const twenty30 = sampleAssetHazardDataForVegaLite?.['2030']
  const twenty40 = sampleAssetHazardDataForVegaLite?.['2040']
  const twenty50 = sampleAssetHazardDataForVegaLite?.['2050']
  const assetHazardDataForVegaLite = [
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

  // function getRandomInRange(min: number, max: number) {
  //   return Math.floor(Math.random() * (max - min + 1)) + min
  // }

  // const generateFakeTableData = () => {
  //   const scenarios = ['ssp126', 'ssp245', 'ssp585']
  //   const years = ['2030', '2040', '2050']
  //   const data = []

  //   for (let i = 0; i < 5000; i++) {
  //     const obj = { id: i }
  //     for (const year of years) {
  //       for (const scenario of scenarios) {
  //         obj[`${year}_${scenario}_chronicheat`] = getRandomInRange(0, 5)
  //       }
  //     }
  //     data.push(obj)
  //   }

  //   return data
  // }

  // console.log(generateFakeTableData())

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
    myData: assetHazardDataForVegaLite,
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
      <Text>Internal &apos;technically works&apos; demo (not a UX demo)</Text>
      <input
        type="file"
        id="open-assets"
        hidden
        ref={uploadRef}
        accept=".csv, .geojson"
      />
      <Button onClick={() => uploadRef.current?.click()}>
        Open GeoJSON or CSV Assets (proof of concept)
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

      {!isAssetHazardDataLoading && !assetHazardDataError ? (
        <>
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
          <PageSizeSelector
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              table.setPageSize(parseInt(event.target.value))
            }
            pageSize={table.getState().pagination.pageSize}
            pageSizeOptions={[15, 50, 100]}
            unfilteredRowLength={tableData.length}
          />
          <PageSelector
            currentPageIndex={table.getState().pagination.pageIndex}
            nextDisabled={!table.getCanNextPage()}
            onGoToPage={table.setPageIndex}
            onNextClick={table.nextPage}
            onPreviousClick={table.previousPage}
            pageCount={table.getPageCount()}
            previousDisabled={!table.getCanPreviousPage()}
          />
          ,
        </>
      ) : null}
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
      title="Assets"
      sidebarWidth="80%"
    />
  )
}
