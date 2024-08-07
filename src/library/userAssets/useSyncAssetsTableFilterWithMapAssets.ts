import { useEffect, useMemo } from 'react'

import { Table as TanstackTable } from '@tanstack/table-core'
import {
  UserAssetForTable,
  convertDataForTableToGeoJSON,
} from './convertUserAssets'
import { MapRef } from '../../components/Map/useMap'
import { UserAssets } from './userAssetTypes'

export const useSyncAssetsTableFilterWithMapAssets = ({
  isMapLoaded,
  table,
  userAssetsForTable,
  updateUserAssetsInMap,
}: {
  isMapLoaded?: boolean
  mapRef?: MapRef
  table: TanstackTable<UserAssetForTable>
  userAssetsForTable: UserAssetForTable[]
  updateUserAssetsInMap: (assets: UserAssets) => void
}) => {
  const filteredRows = table.getFilteredRowModel().rows

  const filteredAssetsForMap = useMemo(() => {
    const filteredRowsOriginal = filteredRows.map((row) => row.original)
    return convertDataForTableToGeoJSON(filteredRowsOriginal)
  }, [filteredRows])

  useEffect(
    function syncMapWithTableFilter() {
      if (!userAssetsForTable.length || !isMapLoaded) return

      updateUserAssetsInMap(filteredAssetsForMap)
    },
    [
      filteredAssetsForMap,
      isMapLoaded,
      updateUserAssetsInMap,
      userAssetsForTable.length,
    ],
  )
}
