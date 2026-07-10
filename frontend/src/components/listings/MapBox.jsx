import { useEffect, useRef } from 'react'
import './MapBox.css'

export default function MapBox({ listing }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    if (!listing?.geometry?.coordinates?.length) return
    if (mapInstance.current) return // already initialised

    const [lng, lat] = listing.geometry.coordinates

    // Dynamically import mapbox-gl
    import('mapbox-gl').then(({ default: mapboxgl }) => {
      mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN || ''

      mapInstance.current = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: 10,
      })

      new mapboxgl.Marker({ color: '#FE424D' })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<b>${listing.title}</b><br/>${listing.location}`
          )
        )
        .addTo(mapInstance.current)
    })

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [listing])

  if (!listing?.geometry?.coordinates?.length) return null

  return (
    <div className="mapbox-wrap">
      <h3 className="mapbox-title"><i className="fa fa-location-dot" /> Where you'll be</h3>
      <div ref={mapRef} className="mapbox-container" />
    </div>
  )
}
