import { useEffect, useState } from 'react'
import { useMapClickToUpdateDraggableMarker } from '../../Map/useMapClickToUpdateDraggableMarker'
import { MapRef } from '../../Map/useMap'
import axios from 'axios'

export const useGetObservationValueByMapclick = ({
  isMapLoaded,
  mapRef,
  selectedObservationLayerUrl,
}: {
  isMapLoaded: boolean
  mapRef: MapRef
  selectedObservationLayerUrl: string
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

      const queryUrl = `https://titiler.xyz/cog/point/${markerCoordinates.lng},${markerCoordinates.lat}?url=${selectedObservationLayerUrl}`

      setObservationMarkerValue(null)

      axios
        .get(queryUrl, { signal: axiosController.signal })

        .then((response) => {
          const observationValue = response.data.values[0]
          setObservationMarkerValue(
            observationValue ? Number(observationValue).toFixed(0) : 'Unknown',
          )
        })
        .catch((error) => {
          if (error.code !== 'ERR_CANCELED') {
            setObservationMarkerValue('Unknown')
          }
        })

      return axiosController
    }

    const queryController = queryObservationLayerByCoordinates()

    return () => {
      queryController.abort()
    }
  }, [markerCoordinates, selectedObservationLayerUrl])

  return { markerCoordinates, observationMarkerValue, isMarkerOnMap }
}
