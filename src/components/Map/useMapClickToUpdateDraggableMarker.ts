import { LngLat, MapMouseEvent, Map as MaplibreMap, Marker } from 'maplibre-gl'
import { useEffect, useRef, useState } from 'react'

export const useMapClickToUpdateDraggableMarker = ({
  isMapLoaded,
  mapRef,
}: {
  isMapLoaded: boolean
  mapRef: React.MutableRefObject<MaplibreMap | undefined>
}) => {
  const [coordinates, setCoordinates] = useState<LngLat | undefined>()
  const isMarkerOnMap = useRef(false)
  const marker = useRef(new Marker({ draggable: true }))

  useEffect(
    function initializeMarkerAndClicking() {
      if (!isMapLoaded || !mapRef.current || !marker.current) return

      const handleMapClick = (event: MapMouseEvent) => {
        const { lngLat } = event
        setCoordinates(lngLat)
        marker.current.setLngLat(lngLat)
        if (!isMarkerOnMap.current) {
          marker.current.addTo(mapRef.current!)
          isMarkerOnMap.current = true
        }
      }

      const handleMarkerDragEnd = () => {
        setCoordinates(marker.current.getLngLat())
      }

      mapRef.current.on('click', handleMapClick)
      marker.current.on('dragend', handleMarkerDragEnd)

      const currentMapRef = mapRef.current
      const currentMarker = marker.current

      return () => {
        currentMapRef?.off('click', handleMapClick)
        currentMarker.off('dragend', handleMarkerDragEnd)
        isMarkerOnMap.current = false
      }
    },
    [isMapLoaded, mapRef],
  )

  return {
    markerCoordinates: coordinates,
    isMarkerOnMap: isMarkerOnMap.current,
  }
}
