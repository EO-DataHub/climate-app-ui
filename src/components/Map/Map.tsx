import 'maplibre-gl/dist/maplibre-gl.css'

import mapStyles from './Map.module.css'
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay'
import { useContext } from 'react'
import { LoadingContext } from '../../context/LoadingContext'

export const Map = ({
  mapContainer,
}: {
  mapContainer: React.RefObject<HTMLDivElement>
}) => {
  const { isMapLoading } = useContext(LoadingContext)

  return (
    <div className={mapStyles.mapContainer}>
      <LoadingOverlay isVisible={isMapLoading} />
      <div ref={mapContainer} className={mapStyles.map} />
    </div>
  )
}
