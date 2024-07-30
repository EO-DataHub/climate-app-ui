import { useEffect, useState } from 'react'
import { MapRef } from '../../Map/useMap'
import { useMapClickToUpdateDraggableMarker } from '../../Map/useMapClickToUpdateDraggableMarker'
import axios from 'axios'
import { Spinner, Text } from '@radix-ui/themes'

import riskValueStyles from './HazardRiskValueOverview.module.scss'
import containerStyles from '../../../library/genericStyles/containers.module.scss'

const EDOH_BASE_URL = import.meta.env.VITE_EODH_BASE_URL

export const HazardRiskValueOverview = ({
  hazardIndicator,
  isMapLoaded,
  mapRef,
  scenario,
  year,
  zarrPath,
}: {
  hazardIndicator: string | undefined
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

  const hazardLocationInfo =
    hazardMarkerValue === null ? (
      <div className={riskValueStyles.overviewLoading}>
        <Spinner />
      </div>
    ) : (
      <div className={riskValueStyles.overview}>
        <div className={containerStyles.flexColumnStartStart}>
          <Text size="9" weight="bold">
            {Number(hazardMarkerValue).toFixed(0)}
          </Text>
          <Text size="4" weight="bold">
            {hazardIndicator}
          </Text>
        </div>
        <div>
          <table>
            <tr>
              <th>Latitude:</th>
              <td>{markerCoordinates?.lat.toFixed(4)}°</td>
            </tr>
            <tr>
              <th>Longitude:</th>
              <td>{markerCoordinates?.lng.toFixed(4)}°</td>
            </tr>
            <tr>
              <th>Year:</th>
              <td>{year}</td>
            </tr>
            <tr>
              <th>Scenario:</th>
              <td>{scenario}</td>
            </tr>
          </table>
        </div>
      </div>
    )

  return (
    <>
      {!isMarkerOnMap ? <>Select location on map to view details.</> : null}
      {isMarkerOnMap ? hazardLocationInfo : null}
    </>
  )
}
