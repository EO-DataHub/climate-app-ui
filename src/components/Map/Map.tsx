import 'maplibre-gl/dist/maplibre-gl.css'

import mapStyles from './Map.module.css'

export const Map = ({
  mapContainer,
}: {
  mapContainer: React.RefObject<HTMLDivElement>
}) => {
  return <div ref={mapContainer} className={mapStyles.map} />
}
