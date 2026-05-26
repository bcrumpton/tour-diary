export default function TourStopField({ stop, index, total, onUpdate, onRemove, onMoveUp, onMoveDown }) {
  async function geocode(city, state) {
    if (!city.trim() || !state.trim()) return
    onUpdate(index, { geocodeStatus: 'loading', geocodeError: null, lat: null, lng: null })
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=US&format=json&limit=1`
      )
      const data = await res.json()
      if (!data.length) {
        onUpdate(index, { geocodeStatus: 'error', geocodeError: 'Location not found — try a different spelling' })
      } else {
        onUpdate(index, { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), geocodeStatus: 'success', geocodeError: null })
      }
    } catch {
      onUpdate(index, { geocodeStatus: 'error', geocodeError: 'Geocoding failed — check your connection' })
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    onUpdate(index, { [name]: value })
  }

  function handleBlur(e) {
    const { name, value } = e.target
    if (name === 'city' || name === 'state') {
      const city = name === 'city' ? value : stop.city
      const state = name === 'state' ? value : stop.state
      geocode(city, state)
    }
  }

  return (
    <div className="tour-stop">
      <div className="tour-stop-header">
        <span className="tour-stop-label">Stop {index + 1}</span>
        <div className="tour-stop-actions">
          <button type="button" className="tour-stop-btn" onClick={onMoveUp} disabled={index === 0} title="Move up">↑</button>
          <button type="button" className="tour-stop-btn" onClick={onMoveDown} disabled={index === total - 1} title="Move down">↓</button>
          <button type="button" className="tour-stop-btn" onClick={onRemove} title="Remove">✕</button>
        </div>
      </div>
      <input className="stop-input" name="venue" placeholder="Venue" value={stop.venue} onChange={handleChange} />
      <div className="stop-location-row">
        <input className="stop-input" name="city" placeholder="City" value={stop.city} onChange={handleChange} onBlur={handleBlur} />
        <input className="stop-input" name="state" placeholder="State" value={stop.state} onChange={handleChange} onBlur={handleBlur} />
      </div>
      <input className="stop-input" name="date" type="date" value={stop.date} onChange={handleChange} />
      {stop.geocodeStatus === 'loading' && <span className="geocode-status geocode-loading">Locating...</span>}
      {stop.geocodeStatus === 'success' && <span className="geocode-status geocode-success">✓ Located</span>}
      {stop.geocodeStatus === 'error' && <span className="geocode-status geocode-error">{stop.geocodeError}</span>}
    </div>
  )
}
