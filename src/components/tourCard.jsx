import { Link } from 'react-router-dom'
import { pb } from '../../pocketbase'

export default function TourCard({ id, collectionId, flyer, name, year, bands, priority }) {
  const imageUrl = flyer ? pb.files.getURL({ id, collectionId }, flyer, { thumb: '480x640' }) : null
  const bandList = bands ? bands.split(/\r?\n/) : []

  return (
    <Link to={`/tours/${id}`} className="show-card">
      <div className="card-image" style={{ '--flyer-url': `url(${imageUrl})` }}>
        <img
          src={imageUrl}
          alt={name}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </div>
      <div className="card-info">
        <h2 className="card-title">{name}</h2>
        <p className="card-date">{year}</p>
        {bandList.length > 0 && (
          <p className="card-bands truncate-overflow">{bandList.join(', ')}</p>
        )}
      </div>
    </Link>
  )
}
