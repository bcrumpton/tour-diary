import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { pb } from '../../pocketbase'

export default function ShowCard({ id, collectionId, flyer, venue, city, state, bands, date }) {
  const imageUrl = flyer ? pb.files.getURL({ id, collectionId }, flyer) : null
  const bandList = bands ? bands.split(/\r?\n/) : []

  return (
    <Link to={`/shows/${id}`} className="show-card">
      <div className="card-image" style={{ '--flyer-url': `url(${imageUrl})` }}>
        <img src={imageUrl} alt={venue} />
      </div>
      <div className="card-info">
        <h2 className="card-title">{venue}</h2>
        <p className="card-meta">{city}, {state}</p>
        {date && <p className="card-date">{format(new Date(date), 'MMM d, yyyy')}</p>}
        {bandList.length > 0 && (
          <p className="card-bands truncate-overflow">{bandList.join(', ')}</p>
        )}
      </div>
    </Link>
  )
}
