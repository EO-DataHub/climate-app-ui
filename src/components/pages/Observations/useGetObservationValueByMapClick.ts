import { useContext, useEffect } from 'react'
import { useMapClickToUpdateDraggableMarker } from '../../Map/useMapClickToUpdateDraggableMarker'
import { MapRef } from '../../Map/useMap'
import axios from 'axios'
import { ObservationsPageContext } from '../../../context/ObservationsPageContext'

const HUB_BASE_URL = import.meta.env.VITE_HUB_BASE_URL
const SPARKGEO_BASE_URL = import.meta.env.VITE_SPARKGEO_BASE_URL

export const useGetObservationValueByMapclick = ({
  isMapLoaded,
  mapRef,
  use_cog_urls,
}: {
  isMapLoaded: boolean
  mapRef: MapRef
  use_cog_urls: boolean
}) => {
  const {
    markerCoordinates,
    observationMarkerValue,
    selectedObservationLayerUrl,
    setMarkerCoordinates,
    setObservationMarkerValue,
  } = useContext(ObservationsPageContext)

  useMapClickToUpdateDraggableMarker({
    isMapLoaded,
    mapRef,
    markerCoordinates,
    setMarkerCoordinates,
  })

  useEffect(
    function setObservationValueOnMarkerCoordinateChange() {
      if (
        !markerCoordinates?.lat ||
        !markerCoordinates?.lng ||
        !selectedObservationLayerUrl ||
        !setObservationMarkerValue
      )
        return

      const queryObservationLayerByCoordinates = () => {
        const axiosController = new AbortController()

        const queryUrl = use_cog_urls
          ? `${HUB_BASE_URL}/titiler/core/cog/point/${markerCoordinates.lng},${markerCoordinates.lat}?url=${selectedObservationLayerUrl}`
          : `${SPARKGEO_BASE_URL}/get_value?zarr_path=${selectedObservationLayerUrl}&latitude=${markerCoordinates.lat}&longitude=${markerCoordinates.lng}&expression=x-273.15&data_variables=lst&data_variables=lst_uncertainty`
        setObservationMarkerValue(null)

        axios
          .get(queryUrl, { signal: axiosController.signal })
          .then((response) => {
            const observationValue = use_cog_urls
              ? response.data.values[0]
              : response.data.lst
            const observationUncertainty = use_cog_urls
              ? null
              : response.data.lst_uncertainty
            setObservationMarkerValue(
              observationValue
                ? `${Number(observationValue).toFixed(2)} (±${Number(observationUncertainty).toFixed(2)})`
                : 'Unknown',
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
    },
    [
      markerCoordinates,
      selectedObservationLayerUrl,
      setObservationMarkerValue,
      use_cog_urls,
    ],
  )

  return { observationMarkerValue }
}
