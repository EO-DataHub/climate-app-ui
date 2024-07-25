import 'maplibre-gl/dist/maplibre-gl.css'

import mapStyles from './Map.module.css'
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay'

export const Map = ({
  mapContainer,
}: {
  mapContainer: React.RefObject<HTMLDivElement>
}) => {
  return (
    <div className={mapStyles.mapContainer}>
      <LoadingOverlay isVisible={true} />
      <div ref={mapContainer} className={mapStyles.map} />
    </div>
  )
}
