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
import { MagnifyingGlassIcon as SearchIcon } from '@radix-ui/react-icons'
import { Table, TextField, Tooltip, Text, Link } from '@radix-ui/themes'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { getTablePageIndexByRowId } from '../../library/tanStackTable/getTablePageIndexByRowId'
import { IconButtonOverride } from '../IconButtonOverride/IconButtonOverride'
import { IndeterminateCheckbox } from '../IndeterminateCheckbox/IndeterminateCheckbox'
import { MapRef } from '../Map/useMap'
import { PageSelector } from '../Pagination/PageSelector/PageSelector'
import { RowSelection } from '../../library/userAssets/userAssetTypes'
import { useAssetPortfolios } from '../../library/userAssets/useAssetPortfolios'
import { useDebouncedCallback } from 'use-debounce'
import {
  AnalysedOscUserAssetForTable,
  UserAssetForTable,
} from '../../library/userAssets/convertUserAssets'
import { useSyncAssetsTableFilterWithMapAssets } from '../../library/userAssets/useSyncAssetsTableFilterWithMapAssets'
import { useSyncAssetsTableSelectionWithMapAssets } from '../../library/userAssets/useSyncAssetsTableSelectionWithMapAssets'
import containerStyles from '../../library/genericStyles/containers.module.scss'
import EyeClosedIcon from '@material-design-icons/svg/filled/visibility_off.svg?react'
import EyeOpenIcon from '@material-design-icons/svg/filled/visibility.svg?react'
import tableStyles from './AssetsTable.module.scss'
import { DEFAULT_USER_ASSET_COLUMNS } from '../../configuration/constants'

const getUniqueColumnNames = (
  previousValue: string[],
  currentValue: UserAssetForTable,
) => {
  return [
    ...new Set([...previousValue, ...Object.keys(currentValue)]),
  ] as string[]
}

export const AssetsTable = ({
  areExtraColumnsVisibleInitially = false,
  isMapLoaded,
  mapRef,
  onViewDetailsClick,
  rowSelection,
  setRowSelection,
  showExtraColumnsToggle = true,
  showPageSelector = true,
  showSearch = true,
  showSelectBoxes = true,
  showViewDetailsButton = false,
  title = 'Assets',
  upperRightTitleRowSlot,
  userAssetsForTable,
}: {
  areExtraColumnsVisibleInitially?: boolean
  isMapLoaded?: boolean
  mapRef?: MapRef
  onViewDetailsClick?: (id: string | number) => void
  rowSelection: RowSelection
  setRowSelection: Dispatch<SetStateAction<RowSelection>>
  showExtraColumnsToggle?: boolean
  showPageSelector?: boolean
  showSearch?: boolean
  showSelectBoxes?: boolean
  showViewDetailsButton?: boolean
  title?: string
  upperRightTitleRowSlot?: React.ReactNode
  userAssetsForTable: UserAssetForTable[] | AnalysedOscUserAssetForTable[]
}) => {
  const [areExtraColumnsVisible, setAreExtraColumnsVisible] = useState(
    areExtraColumnsVisibleInitially,
  )
  const [columnVisibility, setColumnVisibility] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null)
  const [tableSearchValue, setTableSearchValue] = useState('')

  const debouncedSetGlobalFilter = useDebouncedCallback((value) => {
    setGlobalFilter(value)
  }, 500)

  const extraColumnNames = useMemo(() => {
    return userAssetsForTable
      .reduce(getUniqueColumnNames, [])
      .filter((columnName) => {
        return !DEFAULT_USER_ASSET_COLUMNS.includes(columnName)
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
  const { toggleAllMapAssetsSelection, toggleMapAssetSelection } =
    useSyncAssetsTableSelectionWithMapAssets({
      isMapLoaded,
      mapRef,
      userAssetsForTable,
      rowSelection,
    })

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<UserAssetForTable>()

    const extraTableColumnSpecifications = extraColumnNames.map((columnName) =>
      columnHelper.accessor(columnName, {}),
    )
    const preDefaultColumns = []
    const endColumns = []
    if (showSelectBoxes) {
      preDefaultColumns.push({
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
      })
    }
    const defaultColumns = [
      columnHelper.accessor('id', { header: 'ID', enableHiding: false }),
      columnHelper.accessor('type', {
        header: 'Asset Type',
      }),
      columnHelper.accessor('asset_class', {
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
    ]
    if (showViewDetailsButton) {
      endColumns.push({
        id: 'select',

        meta: { justify: 'end' },
        cell: ({ row }: { row: TanstackRow<UserAssetForTable> }) => {
          return (
            <Link asChild>
              <button onClick={() => onViewDetailsClick?.(row.original.id)}>
                View Details
              </button>
            </Link>
          )
        },
      })
    }

    return [
      ...preDefaultColumns,
      ...defaultColumns,
      ...extraTableColumnSpecifications,
      ...endColumns,
    ]
  }, [
    extraColumnNames,
    onViewDetailsClick,
    showSelectBoxes,
    showViewDetailsButton,
    toggleAllMapAssetsSelection,
    toggleMapAssetSelection,
  ])

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
  const highlightTableRow = useCallback(
    (id: string) => {
      setHighlightedRowId(id)
      const pageIndexForHighlightedRow = getTablePageIndexByRowId({ id, table })
      if (!pageIndexForHighlightedRow) return
      table.setPageIndex(pageIndexForHighlightedRow)
    },
    [table],
  )

  const onMapMarkerPopupClose = useCallback(() => {
    setHighlightedRowId(null)
  }, [])

  const { updateUserAssetsInMap } = useAssetPortfolios({
    isMapLoaded,
    mapRef,
    onHighlightInTableClick: highlightTableRow,
    onMapMarkerPopupClose,
  })

  useSyncAssetsTableFilterWithMapAssets({
    isMapLoaded,
    table,
    updateUserAssetsInMap,
    userAssetsForTable,
  })

  const toggleAreExtraColumnsVisible = () => {
    setAreExtraColumnsVisible(!areExtraColumnsVisible)
  }

  const toggleAreExtraColumnsVisibleButton = (
    <Tooltip
      content={areExtraColumnsVisible ? 'Hide Fields' : 'View all Fields'}
    >
      <IconButtonOverride
        variant="soft"
        onClick={toggleAreExtraColumnsVisible}
        type="button"
      >
        {areExtraColumnsVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}
      </IconButtonOverride>
    </Tooltip>
  )

  return (
    <div className={tableStyles.tableWrapper}>
      <div className={containerStyles.flexRowSpaceBetweenCenter}>
        <Text weight="bold">{title}</Text>
        <div className={tableStyles.tableInputWrapper}>
          {showSearch ? (
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
          ) : null}
          {upperRightTitleRowSlot ? upperRightTitleRowSlot : null}
          {extraColumnNames.length && showExtraColumnsToggle
            ? toggleAreExtraColumnsVisibleButton
            : null}
        </div>
      </div>

      <Table.Root variant="surface" className={tableStyles.table}>
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
                            : header.column.getNextSortingOrder() === 'desc'
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
          {table.getRowModel().rows.map((row) => {
            const classNameHighlighted =
              row.id === highlightedRowId
                ? tableStyles.highlightedTableRow
                : undefined
            const classNameSelected = row.getIsSelected()
              ? tableStyles.selectedTableRow
              : undefined

            const className = classNameHighlighted ?? classNameSelected
            return (
              <Table.Row
                key={`${String(row.id)}-${String(row.original.scenario)}-${String(row.original.indicator)}-${String(row.original.year)}`}
                className={className}
              >
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell
                    key={cell.id}
                    // @ts-expect-error - meta allows for any property
                    justify={cell.column.columnDef.meta?.justify}
                    className={tableStyles.tableCell}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
      {showPageSelector ? (
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
      ) : null}
    </div>
  )
}
