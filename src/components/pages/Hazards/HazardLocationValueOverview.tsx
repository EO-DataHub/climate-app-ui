import { MapRef } from '../../Map/useMap'
import { useEffect, useState } from 'react'
import { useMapClickToUpdateDraggableMarker } from '../../Map/useMapClickToUpdateDraggableMarker'
import axios from 'axios'

import { LocationValueOverview } from '../../LocationValueOverview/LocationValueOverview'

const EDOH_BASE_URL = import.meta.env.VITE_EODH_BASE_URL

export const HazardLocationValueOverview = ({
  hazardIndicatorLabel,
  isMapLoaded,
  mapRef,
  scenario,
  year,
  zarrPath,
}: {
  hazardIndicatorLabel: string | undefined
  isMapLoaded: boolean
  mapRef: MapRef
  scenario: string | undefined
  year: string | undefined
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
            setHazardMarkerValue(res.data.hazard_value)
          })
          .catch((error) => {
            if (error.code !== 'ERR_CANCELED') {
              setHazardMarkerValue('unknown')
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

  return (
    <>
      {!isMarkerOnMap ? <>Select location on map to view details.</> : null}
      {isMarkerOnMap ? (
        <LocationValueOverview
          layerLabel={hazardIndicatorLabel}
          locationValue={hazardMarkerValue}
          markerCoordinates={markerCoordinates}
          scenario={scenario}
          year={year}
        />
      ) : null}
    </>
  )
}
