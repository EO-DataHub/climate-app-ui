import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button, Table } from '@radix-ui/themes'
import { useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { AssetsSelect } from '../../AssetsSelect'
import { Map } from '../../Map/Map'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { UploadButtonAndDialog } from '../../UploadButtonAndDialog/UploadButtonAndDialog'
import { useMap } from '../../Map/useMap'
import { UserAssetsContext } from '../../../context/UserAssetsContext'
import assetStyles from './Assets.module.scss'
import containerStyles from '../../../library/genericStyles/containers.module.scss'
import {
  UserAssetsForTable,
  convertGeoJSONToDataForTable,
} from '../../../library/userAssets/convertUserAssetsGeoJsonToTableReadyData'
import { PageSelector } from '../../Pagination/PageSelector/PageSelector'

export const Assets = () => {
  const { mapContainer, mapRef } = useMap()
  const { userAssets } = useContext(UserAssetsContext)
  const navigate = useNavigate()
  const userAssetsForTable = useMemo(
    () => convertGeoJSONToDataForTable(userAssets),
    [userAssets],
  )

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
    initialState: {
      pagination: {
        pageSize: 4,
      },
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
