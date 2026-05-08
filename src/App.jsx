import './App.css'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import FormField from './components/formField'
import TourStopField from './components/tourStopField'
import Message from './components/message'
import Modal from './components/modal'
import { pb } from '../pocketbase'
import { BsFillPlusCircleFill } from 'react-icons/bs'

const newStop = () => ({
  venue: '', city: '', state: '', date: '',
  lat: null, lng: null, geocodeStatus: null, geocodeError: null,
})

function App() {
  const navigate = useNavigate()

  const initialFormData = {
    date: '', venue: '', city: '', state: '',
    name: '', year: '', bands: '', flyer: null,
  }

  const [formData, setFormData] = useState(initialFormData)
  const [formType, setFormType] = useState('show')
  const [stops, setStops] = useState([])
  const [message, setMessage] = useState(null)
  const [formIsOpen, setFormIsOpen] = useState(false)
  const [editingShow, setEditingShow] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setMessage(null), 3000)
    return () => clearTimeout(timer)
  }, [message])

  function handleChange(e) {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : value,
    }))
  }

  function openEditForm(entry) {
    setEditingShow(entry)
    if (entry.collectionName === 'tours') {
      setFormType('tour')
      setFormData({ name: entry.name, year: String(entry.year), bands: entry.bands || '', flyer: null })
      setStops((entry.dates || []).map(stop => ({
        ...stop,
        geocodeStatus: stop.lat && stop.lng ? 'success' : null,
        geocodeError: null,
      })))
    } else {
      setFormType('show')
      setFormData({
        date: entry.date.split(' ')[0],
        venue: entry.venue,
        city: entry.city,
        state: entry.state,
        bands: entry.bands || '',
        flyer: null,
      })
      setStops([])
    }
    setFormIsOpen(true)
  }

  async function deleteEntry(entry) {
    const collection = entry.collectionName === 'tours' ? 'tours' : 'shows'
    await pb.collection(collection).delete(entry.id)
    navigate('/')
  }

  function updateStop(index, updates) {
    setStops(prev => prev.map((s, i) => i === index ? { ...s, ...updates } : s))
  }

  function addStop() {
    setStops(prev => [...prev, newStop()])
  }

  function removeStop(index) {
    setStops(prev => prev.filter((_, i) => i !== index))
  }

  function moveStop(index, direction) {
    setStops(prev => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  async function submitForm(event) {
    event.preventDefault()
    if (formData.password !== 'mellon') {
      setMessage({ text: 'Please enter the correct password', type: 'error' })
      return
    }

    try {
      if (formType === 'tour') {
        const ungeocoded = stops.filter(s => s.geocodeStatus !== 'success')
        if (ungeocoded.length > 0) {
          setMessage({ text: 'All stops must be located before saving.', type: 'error' })
          return
        }
        const dates = stops.map(({ venue, city, state, date, lat, lng }) => ({ venue, city, state, date, lat, lng }))
        const data = new FormData()
        data.append('name', formData.name)
        data.append('year', parseInt(formData.year))
        data.append('bands', formData.bands)
        data.append('dates', JSON.stringify(dates))
        if (formData.flyer) data.append('flyer', formData.flyer)

        if (editingShow) {
          await pb.collection('tours').update(editingShow.id, data)
          closeForm()
          navigate(`/tours/${editingShow.id}`, { replace: true })
        } else {
          await pb.collection('tours').create(data)
          setFormData(initialFormData)
          setStops([])
          setMessage({ text: 'Tour added successfully.', type: 'success' })
          navigate('/')
        }
      } else {
        const { name, year, password, ...showFields } = formData
        const filtered = Object.fromEntries(
          Object.entries(showFields).filter(([, v]) => v !== null && v !== '')
        )
        if (editingShow) {
          await pb.collection('shows').update(editingShow.id, filtered)
          closeForm()
          navigate(`/shows/${editingShow.id}`, { replace: true })
        } else {
          await pb.collection('shows').create(filtered)
          setFormData(initialFormData)
          setMessage({ text: 'Show added successfully.', type: 'success' })
          navigate('/')
        }
      }
    } catch (err) {
      setMessage({ text: `Error: Something went wrong. ${err}`, type: 'error' })
    }
  }

  function switchFormType(type) {
    if (editingShow) return
    setFormType(type)
    setFormData(initialFormData)
    setStops([])
  }

  function closeForm() {
    setFormIsOpen(false)
    setEditingShow(null)
    setMessage(null)
  }

  return (
    <>
      <nav className="nav">
        <div className="nav-inner container">
          <Link to="/" className="nav-logo">Tour Diary</Link>
          <button className="nav-add-btn" onClick={() => {
            setEditingShow(null)
            setFormData(initialFormData)
            setStops([])
            setFormType('show')
            setFormIsOpen(true)
          }}>
            <BsFillPlusCircleFill size={28} />
          </button>
        </div>
      </nav>

      <main>
        <Outlet context={{ openEditForm, deleteEntry }} />
      </main>

      {formIsOpen && (
        <Modal onClose={closeForm}>
          <div className="form-tabs">
            <button
              type="button"
              className={`form-tab${formType === 'show' ? ' active' : ''}`}
              onClick={() => switchFormType('show')}
              disabled={!!editingShow && formType !== 'show'}
            >
              Show
            </button>
            <button
              type="button"
              className={`form-tab${formType === 'tour' ? ' active' : ''}`}
              onClick={() => switchFormType('tour')}
              disabled={!!editingShow && formType !== 'tour'}
            >
              Tour
            </button>
          </div>
          <h2>{editingShow ? `Edit ${formType === 'tour' ? 'Tour' : 'Show'}` : `Add ${formType === 'tour' ? 'Tour' : 'Show'}`}</h2>
          <form className="show-form" method="post" encType="multipart/form-data" onSubmit={submitForm}>
            {formType === 'show' ? (
              <>
                <FormField required={true} name="date" type="date" value={formData.date || ''} onChange={handleChange} />
                <FormField required={true} placeholder="Ex: Bridgestone Arena" name="venue" type="text" value={formData.venue || ''} onChange={handleChange} />
                <FormField required={true} placeholder="Ex: Nashville" name="city" type="text" value={formData.city || ''} onChange={handleChange} />
                <FormField required={true} placeholder="Ex: TN" name="state" type="text" value={formData.state || ''} onChange={handleChange} />
              </>
            ) : (
              <>
                <FormField required={true} placeholder="Tour name" name="name" type="text" value={formData.name || ''} onChange={handleChange} />
                <FormField required={true} placeholder="Year (e.g. 2024)" name="year" type="number" value={formData.year || ''} onChange={handleChange} />
              </>
            )}
            <FormField required={true} placeholder="Start new line for each band" name="bands" type="textarea" value={formData.bands || ''} rows="5" cols="30" onChange={handleChange} />
            <FormField required={!editingShow} name="flyer" type="file" onChange={handleChange} />

            {formType === 'tour' && (
              <div className="tour-stops">
                <label className="tour-stops-label">Tour Stops</label>
                {stops.map((stop, i) => (
                  <TourStopField
                    key={i}
                    stop={stop}
                    index={i}
                    total={stops.length}
                    onUpdate={updateStop}
                    onRemove={() => removeStop(i)}
                    onMoveUp={() => moveStop(i, -1)}
                    onMoveDown={() => moveStop(i, 1)}
                  />
                ))}
                <button type="button" className="add-stop-btn" onClick={addStop}>+ Add Stop</button>
              </div>
            )}

            <FormField required={true} name="password" type="password" value={formData.password || ''} onChange={handleChange} />
            {message && <Message message={message} />}
            <button type="submit">Upload</button>
          </form>
        </Modal>
      )}
    </>
  )
}

export default App
