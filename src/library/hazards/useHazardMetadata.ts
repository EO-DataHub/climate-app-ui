import { LoadingContext } from '../../context/LoadingContext'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'

export interface HazardMetadata {
  properties: { ['osc-hazard:description']: string }
}

export const useHazardMetadata = ({
  climateModel,
  hazardIndicator,
  hazardType,
  scenario,
  year,
}: {
  climateModel: string
  hazardIndicator: string
  hazardType: string
  scenario: string
  year: string
}) => {
  const [hazardMetadata, setHazardMetadata] = useState<
    HazardMetadata | undefined | null
  >()
  const [isHazardMetadataError, setIsHazardMetadataError] = useState(false)
  const [isHazardMetadataLoading, setIsHazardMetadataLoading] = useState(false)
  const { setIsLoading } = useContext(LoadingContext)

  useEffect(
    function getHazardMetadata() {
      if (
        !setIsLoading ||
        !hazardIndicator ||
        !hazardType ||
        !climateModel ||
        !scenario ||
        !year
      ) {
        return
      }

      setIsHazardMetadataError(false)
      setIsHazardMetadataLoading(true)
      // We will convert to use environment var when we start using APIs for real
      // and their baseUrls present themselves.
      // Directly accessing S3 is only temporary.
      const metadataUrlForHazard = `https://ukri-eodh-hazard-tiles-test.s3.amazonaws.com/hazard-test-titiler-xarray/${hazardType}_osc_v2_${hazardIndicator}_${climateModel}_${scenario}_${year}.json`
      axios
        .get(metadataUrlForHazard)
        .then((res) => {
          setHazardMetadata(res.data)
        })
        .catch(() => {
          setIsHazardMetadataError(true)
          setHazardMetadata(null)
        })
        .finally(() => {
          setIsHazardMetadataLoading(false)
        })
    },
    [climateModel, hazardIndicator, hazardType, scenario, setIsLoading, year],
  )

  return { isHazardMetadataError, isHazardMetadataLoading, hazardMetadata }
}
