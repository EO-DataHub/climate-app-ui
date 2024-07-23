import { useEffect, useMemo } from 'react'

import { Table as TanstackTable } from '@tanstack/table-core'
import {
  UserAssetForTable,
  convertDataForTableToGeoJSON,
} from './convertUserAssets'
import { useAssetPortfolios } from './useAssetPortfolios'
import { MapRef } from '../../components/Map/useMap'

export const useSyncAssetsTableFilterWithMapAssets = ({
  isMapLoaded,
  mapRef,
  table,
  userAssetsForTable,
}: {
  isMapLoaded?: boolean
  mapRef?: MapRef
  table: TanstackTable<UserAssetForTable>
  userAssetsForTable: UserAssetForTable[]
}) => {
  const { updateUserAssetsInMap } = useAssetPortfolios({
    isMapLoaded,
    mapRef,
  })
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
