import React from 'react'
import { format } from 'date-fns'
import { pb } from '../../pocketbase'

export default function showCard({ id, collectionId, flyer, venue, city, state, bands, date, onClick }) {
  const imageUrl = flyer
    ? pb.files.getURL({ id, collectionId }, flyer)
    : null;

  return (
    <div className='showCard' onClick={onClick}>
      <div className="flyer-container" style={{ '--flyer-url': `url(${imageUrl})` }}>
        <img src={imageUrl} alt="" />
      </div>
      <div className='show-information'>
        <h2>{venue}</h2>
        <p>{`${city}, ${state}`}</p>
        <p>{format(new Date(date), "MM/dd/yyyy")}</p>
        <div>
          <p>
            {bands.split(/\r?\n/).map((band, i, arr) => (
              <span className='band' key={i}>{band}{(i + 1) !== arr.length ? ", " : ""}</span>
            ))}
          </p>
        </div>
      </div>
    </div>
  )
}
