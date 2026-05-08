import { useEffect, useState } from 'react'
import { useParams, useOutletContext, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { RiEditCircleFill } from 'react-icons/ri'
import { IoCloseCircle } from 'react-icons/io5'
import { pb } from '../../pocketbase'
import Lightbox from '../components/Lightbox'
import { Helmet } from 'react-helmet-async'

function FitBounds({ dates }) {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLngBounds(dates.map(stop => L.latLng(stop.lat, stop.lng)))
    if (!bounds.isValid()) return
    const id = setTimeout(() => {
      map.invalidateSize()
      map.fitBounds(bounds, { padding: [10, 10] })
    }, 0)
    return () => clearTimeout(id)
  }, [map])
  return null
}

const smallIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [12, 20],
  iconAnchor: [6, 20],
  popupAnchor: [0, -20],
})

export default function TourDetail() {
  const { id } = useParams()
  const { openEditForm, deleteEntry } = useOutletContext()
  const [tour, setTour] = useState(null)
  const [lightbox, setLightbox] = useState(false)

  useEffect(() => {
    pb.collection('tours').getOne(id, { $autoCancel: false }).then(setTour)
  }, [id])

  if (!tour) return <div className="container loading">Loading...</div>

  const imageUrl = pb.files.getURL({ id: tour.id, collectionId: tour.collectionId }, tour.flyer)
  const title = `${tour.name} · ${tour.year}`
  const description = tour.bands ? tour.bands.split(/\r?\n/).join(', ') : ''

  return (
    <div className="detail-page container">
      <Helmet>
        <title>{title} · Tour Diary</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>
      <Link to="/" className="back-link">← All Shows</Link>
      <div className="detail-layout">
        <div className="detail-flyer">
          <img
            src={pb.files.getURL({ id: tour.id, collectionId: tour.collectionId }, tour.flyer)}
            alt={tour.name}
            className="flyer-clickable"
            onClick={() => setLightbox(true)}
          />
        </div>
        {lightbox && (
          <Lightbox
            src={pb.files.getURL({ id: tour.id, collectionId: tour.collectionId }, tour.flyer)}
            alt={tour.name}
            onClose={() => setLightbox(false)}
          />
        )}
        <div className="detail-info">
          <div className="detail-header">
            <h1>{tour.name}</h1>
            <div className="detail-actions">
              <button className="button-invisible" onClick={() => openEditForm(tour)}>
                <RiEditCircleFill size={28} />
              </button>
              <button className="button-invisible" onClick={() => deleteEntry(tour)}>
                <IoCloseCircle size={30} />
              </button>
            </div>
          </div>
          <p className="detail-year">{tour.year}</p>
          {tour.bands && (
            <div className="detail-bands">
              {tour.bands.split(/\r?\n/).map((band, i, arr) => (
                <span key={i}>{band}{i + 1 !== arr.length ? ', ' : ''}</span>
              ))}
            </div>
          )}
          {tour.dates?.length > 0 && (
            <>
              <MapContainer
                className="leaflet-route"
                center={[0, 0]}
                zoom={2}
                style={{ height: '400px', width: '100%' }}
              >
                <FitBounds dates={tour.dates} />
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <Polyline positions={tour.dates.map(stop => [stop.lat, stop.lng])} color="#C8860A" />
                {tour.dates.map((stop, i) => (
                  <Marker key={i} position={[stop.lat, stop.lng]} icon={smallIcon}>
                    {(stop.venue || stop.date) && (
                      <Popup>
                        {stop.venue && <strong>{stop.venue}</strong>}
                        {stop.venue && stop.date && <br />}
                        {stop.date && format(new Date(stop.date), 'MMM d, yyyy')}
                      </Popup>
                    )}
                  </Marker>
                ))}
              </MapContainer>
              <ol className="tour-stop-list">
                {tour.dates.map((stop, i) => (
                  <li key={i} className="tour-stop-item">
                    <span className="tour-stop-number">{i + 1}</span>
                    <div className="tour-stop-details">
                      {stop.venue && <span className="tour-stop-venue">{stop.venue}</span>}
                      <span className="tour-stop-location">{[stop.city, stop.state].filter(Boolean).join(', ')}</span>
                    </div>
                    {stop.date && <span className="tour-stop-date">{format(new Date(stop.date), 'MMM d, yyyy')}</span>}
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
