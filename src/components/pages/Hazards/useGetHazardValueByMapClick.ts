import { useEffect, useState } from 'react'
import { useMapClickToUpdateDraggableMarker } from '../../Map/useMapClickToUpdateDraggableMarker'
import { MapRef } from '../../Map/useMap'
import axios from 'axios'

const EDOH_BASE_URL = import.meta.env.VITE_EODH_BASE_URL

export const useGetHazardValueByMapClick = ({
  isMapLoaded,
  mapRef,
  zarrPath,
}: {
  isMapLoaded: boolean
  mapRef: MapRef
  zarrPath: string
}) => {
  const [hazardMarkerValue, setHazardMarkerValue] = useState<
    number | string | null
  >(null)

  const { markerCoordinates, isMarkerOnMap } =
    useMapClickToUpdateDraggableMarker({
      isMapLoaded,
      mapRef,
    })

  useEffect(
    function getHazardValueAtLocation() {
      const queryHazardValueByCoordinates = () => {
        if (!markerCoordinates?.lat || !markerCoordinates?.lng) return

        const axiosController = new AbortController()

        // Bodge to use version of the zarrs which are quicker to load for getting value at a point
        const sgZarrPath = zarrPath.replace(
          'ukri-eodh-hazard-tiles-test',
          'ukri-eodh-hazard-tiles-sg',
        )
        const url = `${EDOH_BASE_URL}/get_hazard_value?zarr_path=${sgZarrPath}/&latitude=${markerCoordinates.lat}&longitude=${markerCoordinates.lng}`

        setHazardMarkerValue(null)

        axios
          .get(url, { signal: axiosController.signal })
          .then((res) => {
            const hazardValue = res.data.hazard_value
            setHazardMarkerValue(
              hazardValue ? Number(hazardValue).toFixed(0) : 'Unknown',
            )
          })
          .catch((error) => {
            if (error.code !== 'ERR_CANCELED') {
              setHazardMarkerValue('Unknown')
            }
          })

        return axiosController
      }

      const queryController = queryHazardValueByCoordinates()

      return () => {
        queryController?.abort()
      }
    },
    [markerCoordinates, zarrPath],
  )

  return { hazardMarkerValue, isMarkerOnMap, markerCoordinates }
}
