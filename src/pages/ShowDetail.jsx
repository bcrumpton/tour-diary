import { useEffect, useState } from 'react'
import { useParams, useOutletContext, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { RiEditCircleFill } from 'react-icons/ri'
import { IoCloseCircle } from 'react-icons/io5'
import { pb } from '../../pocketbase'
import Lightbox from '../components/Lightbox'
import { Helmet } from 'react-helmet-async'

export default function ShowDetail() {
  const { id } = useParams()
  const { openEditForm, deleteEntry } = useOutletContext()
  const [show, setShow] = useState(null)
  const [lightbox, setLightbox] = useState(false)

  useEffect(() => {
    pb.collection('shows').getOne(id, { $autoCancel: false }).then(setShow)
  }, [id])

  if (!show) return <div className="container loading">Loading...</div>

  const imageUrl = pb.files.getURL({ id: show.id, collectionId: show.collectionId }, show.flyer, { thumb: '1000x0' })
  const title = `${show.venue} — ${show.city}, ${show.state}`
  const description = [
    show.date ? format(new Date(show.date), 'MMMM d, yyyy') : null,
    show.bands ? show.bands.split(/\r?\n/).join(', ') : null,
  ].filter(Boolean).join(' · ')

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
            src={imageUrl}
            alt={show.venue}
            className="flyer-clickable"
            onClick={() => setLightbox(true)}
          />
        </div>
        {lightbox && (
          <Lightbox
            src={pb.files.getURL({ id: show.id, collectionId: show.collectionId }, show.flyer)}
            alt={show.venue}
            onClose={() => setLightbox(false)}
          />
        )}
        <div className="detail-info">
          <div className="detail-header">
            <h1>{show.venue}</h1>
            <div className="detail-actions">
              <button className="button-invisible" onClick={() => openEditForm(show)}>
                <RiEditCircleFill size={28} />
              </button>
              <button className="button-invisible" onClick={() => deleteEntry(show)}>
                <IoCloseCircle size={30} />
              </button>
            </div>
          </div>
          <p className="detail-location">{show.city}, {show.state}</p>
          {show.date && (
            <p className="detail-date">{format(new Date(show.date), 'MMMM d, yyyy')}</p>
          )}
          {show.bands && (
            <div className="detail-bands">
              {show.bands.split(/\r?\n/).map((band, i, arr) => (
                <span key={i}>{band}{i + 1 !== arr.length ? ', ' : ''}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
