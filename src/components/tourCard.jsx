import { pb } from "../../pocketbase"

export default function TourCard({ onClick, id, collectionId, bands, dates, flyer, name, year }) {
  const imageUrl = flyer
    ? pb.files.getURL({ id, collectionId }, flyer)
    : null;
  return (
    <div className='showCard' onClick={onClick}>
      <div className="flyer-container" style={{ '--flyer-url': `url(${imageUrl})` }}>
        <img src={imageUrl} alt="" />
      </div>
      <div className='show-information'>
        <h2>{name}</h2>
        <p>{year}</p>
        <div className="truncate-overflow">
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