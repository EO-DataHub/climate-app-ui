import { MapRef } from '../../Map/useMap'
import { useMapClickToUpdateDraggableMarker } from '../../Map/useMapClickToUpdateDraggableMarker'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { LocationValueOverview } from '../../LocationValueOverview/LocationValueOverview'

export const ObservationLocationValueOverview = ({
  isMapLoaded,
  mapRef,
  selectedObservationLayerId,
  selectedObservationLayerLabel,
}: {
  isMapLoaded: boolean
  mapRef: MapRef
  selectedObservationLayerId: string
  selectedObservationLayerLabel: string
}) => {
  const [observationMarkerValue, setObservationMarkerValue] = useState<
    number | string | null
  >(null)
  const { markerCoordinates, isMarkerOnMap } =
    useMapClickToUpdateDraggableMarker({
      isMapLoaded,
      mapRef,
    })

  useEffect(() => {
    if (!markerCoordinates?.lat || !markerCoordinates?.lng) return

    const queryObservationLayerByCoordinates = () => {
      const axiosController = new AbortController()

      const queryUrl = `https://titiler.xyz/cog/point/${markerCoordinates.lng},${markerCoordinates.lat}?url=${selectedObservationLayerId}`

      setObservationMarkerValue(null)

      axios
        .get(queryUrl, { signal: axiosController.signal })

        .then((response) => {
          setObservationMarkerValue(response.data.values[0])
        })
        .catch((error) => {
          if (error.code !== 'ERR_CANCELED') {
            setObservationMarkerValue('unknown')
          }
        })

      return axiosController
    }

    const queryController = queryObservationLayerByCoordinates()

    return () => {
      queryController.abort()
    }
  }, [markerCoordinates, selectedObservationLayerId])

  return (
    <>
      {!isMarkerOnMap ? <>Select location on map to view details.</> : null}
      {isMarkerOnMap ? (
        <LocationValueOverview
          markerCoordinates={markerCoordinates}
          locationValue={observationMarkerValue}
          layerLabel={selectedObservationLayerLabel}
        />
      ) : null}
    </>
  )
}
