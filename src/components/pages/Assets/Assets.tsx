import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table as TanstackTable,
  Row as TanstackRow,
} from '@tanstack/table-core'
import { Button, Table, TextField } from '@radix-ui/themes'
import { MagnifyingGlassIcon as SearchIcon } from '@radix-ui/react-icons'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FilterIcon from '@material-design-icons/svg/filled/filter_list.svg?react'

import {
  UserAssetForTable,
  convertDataForTableToGeoJSON,
  convertGeoJSONToDataForTable,
} from '../../../library/userAssets/convertUserAssets'
import { AssetsSelect } from '../../AssetsSelect'
import { IconButtonOverride } from '../../IconButtonOverride/IconButtonOverride'
import { IndeterminateCheckbox } from '../../IndeterminateCheckbox/IndeterminateCheckbox'
import { Map } from '../../Map/Map'
import { PageSelector } from '../../Pagination/PageSelector/PageSelector'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { UploadButtonAndDialog } from '../../UploadButtonAndDialog/UploadButtonAndDialog'
import { useDebouncedCallback } from 'use-debounce'
import { useMap } from '../../Map/useMap'
import { UserAssetsContext } from '../../../context/UserAssetsContext'
import { useUpdateUserAssetsInMap } from '../../../library/userAssets/useUpdateUserAssetsInMap'
import assetStyles from './Assets.module.scss'
import containerStyles from '../../../library/genericStyles/containers.module.scss'

export const Assets = () => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [tableSearchValue, setTableSearchValue] = useState('')
  const { mapContainer, mapRef, isMapLoaded } = useMap()
  const { updateUserAssetsInMap } = useUpdateUserAssetsInMap({
    mapRef,
  })
  const { userAssets } = useContext(UserAssetsContext)
  const navigate = useNavigate()
  const userAssetsForTable = useMemo(
    () => convertGeoJSONToDataForTable(userAssets),
    [userAssets],
  )
  const debouncedSetGlobalFilter = useDebouncedCallback((value) => {
    setGlobalFilter(value)
  }, 500)

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<UserAssetForTable>()
    const getUniqueColumnNames = (
      previousValue: string[],
      currentValue: UserAssetForTable,
    ) => {
      return [
        ...new Set([...previousValue, ...Object.keys(currentValue)]),
      ] as string[]
    }
    const extraColumnNames = userAssetsForTable
      .reduce(getUniqueColumnNames, [])
      .filter((columnName) => {
        return !['latitude', 'longitude', 'assetType', ''].includes(columnName)
      })
    const extraTableColumnSpecifications = extraColumnNames.map((columnName) =>
      columnHelper.accessor(columnName, {}),
    )

    return [
      {
        id: 'select',
        header: ({ table }: { table: TanstackTable<UserAssetForTable> }) => {
          const indeterminateValue = table.getIsSomeRowsSelected()
            ? 'indeterminate'
            : false
          return (
            <IndeterminateCheckbox
              checked={table?.getIsAllRowsSelected() || indeterminateValue}
              onCheckedChange={
                table.toggleAllRowsSelected as (checked: boolean) => void
              }
            />
          )
        },

        cell: ({ row }: { row: TanstackRow<UserAssetForTable> }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              checked={row?.getIsSelected()}
              onCheckedChange={row?.getToggleSelectedHandler()}
            />
          </div>
        ),
      },
      columnHelper.accessor('assetType', { header: 'Asset ID' }),
      columnHelper.accessor('latitude', {
        header: 'Latitude',
        meta: { justify: 'end' },
        cell: (cellContent: CellContext<UserAssetForTable, number>) => (
          <>{`${cellContent.row.original.latitude.toFixed(4)}°`}</>
        ),
      }),
      columnHelper.accessor('longitude', {
        header: 'Longitude',
        meta: { justify: 'end' },
        cell: (cellContent: CellContext<UserAssetForTable, number>) => (
          <>{`${cellContent.row.original.longitude.toFixed(4)}°`}</>
        ),
      }),
      ...extraTableColumnSpecifications,
    ]
  }, [userAssetsForTable])

  const table = useReactTable({
    data: userAssetsForTable,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'auto',
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      globalFilter,
      rowSelection,
    },
    debugTable: true,
  })
  const filteredRows = table.getFilteredRowModel().rows

  useEffect(
    function syncMapWithTableFilter() {
      if (!userAssetsForTable.length || !isMapLoaded) return

      const filteredRowsOriginal = filteredRows.map((row) => row.original)

      updateUserAssetsInMap(convertDataForTableToGeoJSON(filteredRowsOriginal))
    },
    [
      filteredRows,
      isMapLoaded,
      updateUserAssetsInMap,
      userAssetsForTable.length,
    ],
  )
  const sidebarContent = (
    <div className={assetStyles.sidebarContent}>
      <div className={assetStyles.sidebarTopSection}>
        <div className={assetStyles.selectPortfolioRow}>
          <AssetsSelect />
          <UploadButtonAndDialog />
        </div>
        {userAssetsForTable.length ? (
          <div className={assetStyles.tableWrapper}>
            <div className={containerStyles.flexRowSpaceBetweenCenter}>
              <TextField.Root
                placeholder="Search"
                value={tableSearchValue ?? ''}
                onChange={(event) => {
                  const { value } = event.target
                  setTableSearchValue(value)
                  debouncedSetGlobalFilter(value)
                }}
              >
                <TextField.Slot>
                  <SearchIcon />
                </TextField.Slot>
              </TextField.Root>
              <IconButtonOverride variant="soft">
                <FilterIcon />
              </IconButtonOverride>
            </div>
            <Table.Root variant="surface" className={assetStyles.table}>
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
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : ''
                            }
                            onClick={header.column.getToggleSortingHandler()}
                            title={
                              header.column.getCanSort()
                                ? header.column.getNextSortingOrder() === 'asc'
                                  ? 'Sort ascending'
                                  : header.column.getNextSortingOrder() ===
                                      'desc'
                                    ? 'Sort descending'
                                    : 'Clear sort'
                                : undefined
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
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
          </div>
        ) : null}
      </div>

      <div className={assetStyles.analyseButtonRow}>
        {userAssets ? (
          <Button
            onClick={() => {
              navigate('/analytics')
            }}
          >
            Analyse Assets
          </Button>
        ) : null}
      </div>
    </div>
  )

  return (
    <PageWithMapLayout
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      title="Assets"
      subtitle="Choose an existing portfolio or open a new file for analysis"
      sidebarWidth="900px"
    />
  )
}
