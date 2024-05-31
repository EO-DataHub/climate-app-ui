import FilterIcon from '@material-design-icons/svg/filled/filter_list.svg?react'

import { Box, Heading, Table, Tabs, TextField } from '@radix-ui/themes'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { Map } from '../../Map/Map'
import { useMap } from '../../Map/useMap'

import analyseAssetsStyles from './AssetsAnalytics.module.scss'
import containerStyles from '../../../library/genericStyles/containers.module.scss'
import {
  FakeAnalyticsData,
  fakeAnalyticsData,
} from '../../../localAssets/fakeAnalyticsData'
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { PageSelector } from '../../Pagination/PageSelector/PageSelector'
import { useUpdateUserAssetsInMap } from '../../../library/userAssets/useUpdateUserAssetsInMap'
import { UserAssets } from '../../../context/UserAssetsContext'
import {
  AssetVulnerability,
  AssetVulnerabilityBadge,
} from '../../AssetVulnerabilityBadge/AssetVulnerabilityBadge'
import { MagnifyingGlassIcon as SearchIcon } from '@radix-ui/react-icons'
import { IconButtonOverride } from '../../IconButtonOverride/IconButtonOverride'
import fakeChartImagePath from '../../../localAssets/fakeBarChart.jpeg'
import {
  UserAssetForTable,
  convertGeoJSONToDataForTable,
} from '../../../library/userAssets/convertUserAssetsGeoJsonToTableReadyData'

const columnHelper = createColumnHelper<UserAssetForTable>()

const columns = [
  columnHelper.accessor('assetType', { header: 'Asset ID' }),
  columnHelper.accessor('latitude', {
    header: 'Latitude',
    meta: { justify: 'end' },
    cell: (cellContent: CellContext<UserAssetForTable, number>) => (
      <>{`${cellContent.row.original.latitude}°`}</>
    ),
  }),
  columnHelper.accessor('longitude', {
    header: 'Longitude',
    meta: { justify: 'end' },
    cell: (cellContent: CellContext<UserAssetForTable, number>) => (
      <>{`${cellContent.row.original.longitude}°`}</>
    ),
  }),
  columnHelper.accessor('country', { header: 'Country' }),
  columnHelper.accessor('vulnerability', {
    header: 'Vulnerability',
    cell: (cellContent: CellContext<UserAssetForTable, string>) => (
      <AssetVulnerabilityBadge
        vulnerability={
          cellContent.row.original.vulnerability as AssetVulnerability
        }
      />
    ),
  }),
]

export const AssetsAnalytics = () => {
  const [fakeAssetData] = useState(() => fakeAnalyticsData as FakeAnalyticsData)
  const [fakeAssetDataForTable] = useState(
    convertGeoJSONToDataForTable(fakeAssetData),
  )
  const { mapContainer, mapRef, isMapLoaded } = useMap()
  const { updateUserAssetsInMap } = useUpdateUserAssetsInMap({ mapRef })
  const legend = <>Legend Placeholder</>

  useEffect(() => {
    if (!updateUserAssetsInMap || !fakeAssetData || !isMapLoaded) return

    updateUserAssetsInMap(fakeAssetData as unknown as UserAssets)
  }, [fakeAssetData, isMapLoaded, updateUserAssetsInMap])

  const table = useReactTable({
    data: fakeAssetDataForTable,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 4,
      },
    },
  })

  const sidebarContent = (
    <div className={containerStyles.sidebarContent}>
      <Tabs.Root
        defaultValue="section1"
        className={analyseAssetsStyles.tabsRoot}
      >
        <Tabs.List>
          <Tabs.Trigger value="section1">Section 1</Tabs.Trigger>
          <Tabs.Trigger value="section2">Section 2</Tabs.Trigger>
          <Tabs.Trigger value="section3">Section 3</Tabs.Trigger>
          <Tabs.Trigger value="section4">Section 4</Tabs.Trigger>
        </Tabs.List>
        <Box pt="3">
          <Tabs.Content value="section1">
            <div
              className={containerStyles.flexRowSpaceBetweenCenter}
              style={{ width: '100%', marginBottom: '48px' }}
            >
              <div
                className={containerStyles.flexColumnStartStart}
                style={{ width: '100%' }}
              >
                <Heading size="3" as="h3">
                  Chart (Placeholder Only)
                </Heading>
                <img
                  src={fakeChartImagePath}
                  className={analyseAssetsStyles.fakeChart}
                />
              </div>
              <div
                className={containerStyles.flexColumnStartStart}
                style={{ width: '100%' }}
              >
                <Heading size="3" as="h3">
                  Chart (Placeholder Only)
                </Heading>
                <img
                  src={fakeChartImagePath}
                  className={analyseAssetsStyles.fakeChart}
                />
              </div>
            </div>
            <div className={containerStyles.flexRowSpaceBetweenCenter}>
              <TextField.Root placeholder="Search">
                <TextField.Slot>
                  <SearchIcon />
                </TextField.Slot>
              </TextField.Root>
              <IconButtonOverride variant="soft">
                <FilterIcon />
              </IconButtonOverride>
            </div>
            <Table.Root
              variant="surface"
              className={analyseAssetsStyles.tableWrapper}
            >
              <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Row key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Table.ColumnHeaderCell
                        key={header.id}
                        colSpan={header.colSpan}
                        // @ts-expect-error - meta allows for any property
                        justify={header.column.columnDef.meta?.justify}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </Table.ColumnHeaderCell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Header>
              <Table.Body>
                {table.getRowModel().rows.map((row) => (
                  <Table.Row key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell
                        key={cell.id}
                        // @ts-expect-error - meta allows for any property
                        justify={cell.column.columnDef.meta?.justify}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <div className={containerStyles.flexRowEndCenter}>
              <PageSelector
                currentPageIndex={table.getState().pagination.pageIndex}
                nextDisabled={!table.getCanNextPage()}
                onGoToPage={table.setPageIndex}
                onNextClick={table.nextPage}
                onPreviousClick={table.previousPage}
                pageCount={table.getPageCount()}
                previousDisabled={!table.getCanPreviousPage()}
              />
            </div>
          </Tabs.Content>

          <Tabs.Content value="section2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
            pretium lorem eget risus venenatis efficitur. Duis nec mi sed nibh
            congue vestibulum ac at magna.
          </Tabs.Content>

          <Tabs.Content value="section3">
            Sed non nunc orci. Sed a ullamcorper metus. In tempor tincidunt urna
            eget vestibulum. Sed malesuada sapien sapien, gravida vulputate orci
            blandit a.
          </Tabs.Content>

          <Tabs.Content value="section4">
            Mauris est quam, malesuada sed velit vitae, laoreet egestas leo.
            Phasellus sagittis tincidunt vestibulum. Pellentesque porta ex eget
            viverra porttitor.
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  )

  return (
    <PageWithMapLayout
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      title="Asset Analysis"
      subtitle="Analytics / portfolio1.csv"
      sidebarWidth="880px"
      legend={legend}
    />
  )
}
