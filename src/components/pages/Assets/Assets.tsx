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
import { Button, Table, TextField } from '@radix-ui/themes'
import { MagnifyingGlassIcon as SearchIcon } from '@radix-ui/react-icons'
import { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FilterIcon from '@material-design-icons/svg/filled/filter_list.svg?react'

import {
  UserAssetsForTable,
  convertGeoJSONToDataForTable,
} from '../../../library/userAssets/convertUserAssetsGeoJsonToTableReadyData'
import { AssetsSelect } from '../../AssetsSelect'
import { Map } from '../../Map/Map'
import { PageSelector } from '../../Pagination/PageSelector/PageSelector'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { UploadButtonAndDialog } from '../../UploadButtonAndDialog/UploadButtonAndDialog'
import { useMap } from '../../Map/useMap'
import { UserAssetsContext } from '../../../context/UserAssetsContext'
import assetStyles from './Assets.module.scss'
import containerStyles from '../../../library/genericStyles/containers.module.scss'
import { IconButtonOverride } from '../../IconButtonOverride/IconButtonOverride'

export const Assets = () => {
  const { mapContainer, mapRef } = useMap()
  const { userAssets } = useContext(UserAssetsContext)
  const navigate = useNavigate()
  const userAssetsForTable = useMemo(
    () => convertGeoJSONToDataForTable(userAssets),
    [userAssets],
  )
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<UserAssetsForTable>()

    return [
      columnHelper.accessor('assetType', { header: 'Asset ID' }),
      columnHelper.accessor('latitude', {
        header: 'Latitude',
        meta: { justify: 'end' },
        cell: (cellContent: CellContext<UserAssetsForTable, number>) => (
          <>{`${cellContent.row.original.latitude}°`}</>
        ),
      }),
      columnHelper.accessor('longitude', {
        header: 'Longitude',
        meta: { justify: 'end' },
        cell: (cellContent: CellContext<UserAssetsForTable, number>) => (
          <>{`${cellContent.row.original.longitude}°`}</>
        ),
      }),
    ]
  }, [])

  const table = useReactTable({
    data: userAssetsForTable,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    // globalFilterFn: 'auto',
    initialState: {
      pagination: {
        pageSize: 4,
      },
    },
    state: {
      globalFilter,
    },
  })
  const sidebarContent = (
    <div className={assetStyles.sidebarContent}>
      <div className={assetStyles.selectPortfolioRow}>
        <AssetsSelect />
        <UploadButtonAndDialog mapRef={mapRef} />
      </div>
      {userAssetsForTable.length ? (
        <div className={assetStyles.tableWrapper}>
          <div className={containerStyles.flexRowSpaceBetweenCenter}>
            <TextField.Root
              placeholder="Search"
              value={globalFilter ?? ''}
              onChange={(event) => {
                setGlobalFilter(event.target.value)
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
