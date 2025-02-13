import axios from 'axios'
import { useContext, useEffect } from 'react'
import { MapRef } from '../../Map/useMap'
import { useMapClickToUpdateDraggableMarker } from '../../Map/useMapClickToUpdateDraggableMarker'
import { HazardsPageContext } from '../../../context/HazardsPageContext'

export const useGetHazardValueByMapClick = ({
  isMapLoaded,
  mapRef,
  zarrPath,
}: {
  isMapLoaded: boolean
  mapRef: MapRef
  zarrPath: string
}) => {
  const { markerCoordinates, setHazardMarkerValue, setMarkerCoordinates } =
    useContext(HazardsPageContext)

  useMapClickToUpdateDraggableMarker({
    isMapLoaded,
    mapRef,
    markerCoordinates,
    setMarkerCoordinates,
  })

  useEffect(
    function getHazardValueAtLocation() {
      const queryHazardValueByCoordinates = () => {
        if (!markerCoordinates?.lat || !markerCoordinates?.lng) return

        const axiosController = new AbortController()

        const url = `https://eodh-eu.sparkgeo.uk/get_hazard_value?zarr_path=${zarrPath}/&latitude=${markerCoordinates.lat}&longitude=${markerCoordinates.lng}`

        setHazardMarkerValue?.(null)

        axios
          .get(url, { signal: axiosController.signal })
          .then((res) => {
            const hazardValue = res.data.hazard_value
            setHazardMarkerValue?.(
              hazardValue !== null && hazardValue !== undefined
                ? Number(hazardValue).toFixed(0)
                : 'Unknown',
            )
          })
          .catch((error) => {
            if (error.code !== 'ERR_CANCELED') {
              setHazardMarkerValue?.('Unknown')
            }
          })

        return axiosController
      }

      const queryController = queryHazardValueByCoordinates()

      return () => {
        queryController?.abort()
      }
    },
    [markerCoordinates, setHazardMarkerValue, zarrPath],
  )
}
