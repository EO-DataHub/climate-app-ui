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
import { Button, Table, TextField, Tooltip } from '@radix-ui/themes'
import { MagnifyingGlassIcon as SearchIcon } from '@radix-ui/react-icons'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EyeClosedIcon from '@material-design-icons/svg/filled/visibility_off.svg?react'
import EyeOpenIcon from '@material-design-icons/svg/filled/visibility.svg?react'

import {
  UserAssetForTable,
  convertGeoJSONToDataForTable,
} from '../../../library/userAssets/convertUserAssets'
import { AssetsSelect } from '../../AssetsSelect/AssetsSelect'
import { IconButtonOverride } from '../../IconButtonOverride/IconButtonOverride'
import { IndeterminateCheckbox } from '../../IndeterminateCheckbox/IndeterminateCheckbox'
import { Map } from '../../Map/Map'
import { PageSelector } from '../../Pagination/PageSelector/PageSelector'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { UploadButtonAndDialog } from '../../UploadButtonAndDialog/UploadButtonAndDialog'
import { useDebouncedCallback } from 'use-debounce'
import { useMap } from '../../Map/useMap'
import { UserAssets } from '../../../library/userAssets/userAssetTypes'
import { UserAssetsContext } from '../../../context/UserAssetsContext'
import { useSyncAssetsTableFilterWithMapAssets } from '../../../library/userAssets/useSyncAssetsTableFilterWithMapAssets'
import { useSyncAssetsTableSelectionWithMapAssets } from '../../../library/userAssets/useSyncAssetsTableSelectionWithMapAssets'
import assetStyles from './Assets.module.scss'
import containerStyles from '../../../library/genericStyles/containers.module.scss'

export const Assets = () => {
  const [columnVisibility, setColumnVisibility] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [tableSearchValue, setTableSearchValue] = useState('')
  const [areExtraColumnsVisible, setAreExtraColumnsVisible] = useState(false)
  const { mapContainer, mapRef, isMapLoaded } = useMap()
  const { userAssets, setUserAssets } = useContext(UserAssetsContext)
  const navigate = useNavigate()
  const userAssetsForTable = useMemo(
    () => convertGeoJSONToDataForTable(userAssets),
    [userAssets],
  )
  const debouncedSetGlobalFilter = useDebouncedCallback((value) => {
    setGlobalFilter(value)
  }, 500)
  const {
    rowSelection,
    setRowSelection,
    toggleAllMapAssetsSelection,
    toggleMapAssetSelection,
  } = useSyncAssetsTableSelectionWithMapAssets({
    isMapLoaded,
    mapRef,
    userAssetsForTable,
  })
  const toggleAreExtraColumnsVisible = () => {
    setAreExtraColumnsVisible(!areExtraColumnsVisible)
  }
  const getUniqueColumnNames = (
    previousValue: string[],
    currentValue: UserAssetForTable,
  ) => {
    return [
      ...new Set([...previousValue, ...Object.keys(currentValue)]),
    ] as string[]
  }
  const extraColumnNames = useMemo(() => {
    return userAssetsForTable
      .reduce(getUniqueColumnNames, [])
      .filter((columnName) => {
        return ![
          'latitude',
          'longitude',
          'assetType',
          'assetCategory',
          'id',
          '',
        ].includes(columnName)
      })
  }, [userAssetsForTable])

  useEffect(
    function updateColumnVisibility() {
      if (!extraColumnNames.length) return

      const newColumnVisibilityState = extraColumnNames.reduce(
        (acc, columnName) => {
          return { ...acc, [columnName]: areExtraColumnsVisible }
        },
        {},
      )

      setColumnVisibility(newColumnVisibilityState)
    },
    [areExtraColumnsVisible, extraColumnNames],
  )

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<UserAssetForTable>()

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
              onCheckedChange={(isSelected: boolean) => {
                table.toggleAllRowsSelected(isSelected)
                toggleAllMapAssetsSelection(isSelected)
              }}
            />
          )
        },

        cell: ({ row }: { row: TanstackRow<UserAssetForTable> }) => {
          const handleAssetSelection = (isSelected: boolean) => {
            toggleMapAssetSelection({
              isSelected,
              id: String(row.original.id),
            })
            row?.getToggleSelectedHandler()(isSelected)
          }

          return (
            <IndeterminateCheckbox
              checked={row?.getIsSelected()}
              onCheckedChange={handleAssetSelection}
            />
          )
        },
      },
      columnHelper.accessor('id', { header: 'ID', enableHiding: false }),
      columnHelper.accessor('assetType', {
        header: 'Asset Type',
      }),
      columnHelper.accessor('assetCategory', {
        header: 'Asset Category',
      }),
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
  }, [extraColumnNames, toggleAllMapAssetsSelection, toggleMapAssetSelection])

  const table = useReactTable({
    columns,
    data: userAssetsForTable,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => String(row.id),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'auto',
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    state: {
      globalFilter,
      rowSelection,
      columnVisibility,
    },
  })

  useSyncAssetsTableFilterWithMapAssets({
    isMapLoaded,
    mapRef,
    table,
    userAssetsForTable,
  })

  const handleLoadAssets = (parsedAssets: UserAssets) => {
    setRowSelection({})
    setUserAssets?.(parsedAssets)
  }

  const toggleAreExtraColumnsVisibleButton = (
    <Tooltip
      content={areExtraColumnsVisible ? 'Hide Fields' : 'View all Fields'}
    >
      <IconButtonOverride variant="soft" onClick={toggleAreExtraColumnsVisible}>
        {areExtraColumnsVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}
      </IconButtonOverride>
    </Tooltip>
  )

  const sidebarContent = (
    <div className={assetStyles.sidebarContent}>
      <div className={assetStyles.sidebarTopSection}>
        <div className={assetStyles.selectPortfolioRow}>
          <AssetsSelect />
          <UploadButtonAndDialog onLoadAssets={handleLoadAssets} />
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
              {extraColumnNames.length
                ? toggleAreExtraColumnsVisibleButton
                : null}
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
                  <Table.Row
                    key={row.id}
                    className={
                      row.getIsSelected()
                        ? assetStyles.selectedTableRow
                        : undefined
                    }
                  >
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
            <div className={containerStyles.flexRowStartCenter}>
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
