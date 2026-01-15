import { useEffect, useState } from 'react'
import ShowCard from './components/showCard'
import FormField from './components/formField'
import './App.css'
import { pb } from '../pocketbase'

function App() {
  const initialFormData = {
    date: "",
    venue: "",
    city: "",
    state: "",
    bands: "",
    flyer: null
  };
  const [shows, setShows] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    loadShows()
  }, []);

  async function loadShows() {
    // fetch shows
    const showData = await pb.collection('shows').getList(1, 50, { $autoCancel: false });

    const { items } = showData;
    
    setShows(items);
  }

  function handleChange(e) {
    const {name, value, files, type} = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : value
    }))
  }

  async function submitShow(event) {
    event.preventDefault();

    try {
      const record = await pb.collection('shows').create(formData);
      console.log('created record', record);
      loadShows();
      setFormData(initialFormData);
    } catch(err) {
      console.error("failed to create", err);
    }
  }

  return (
    <>
      <h1>Tour Diary</h1>

      <form className="show-form" method="post" encType='multipart/form-data'>
        <FormField name="date" type="date" value={formData.date} onChange={handleChange} />
        <FormField name="venue" type="text" value={formData.venue} onChange={handleChange} />
        <FormField name="city" type="text" value={formData.city} onChange={handleChange} />
        <FormField name="state" type="text" value={formData.state} onChange={handleChange} />
        <FormField name="bands" type="textarea" value={formData.bands} rows="5" cols="30" onChange={handleChange} />
        <FormField name="flyer" type="file" onChange={handleChange} />
        <button type="submit" onClick={submitShow}>Upload</button>
      </form>

      <div className="shows-grid">
        {shows.map(show => <ShowCard key={show.id} {...show} />)}
      </div>
    </>
  )
}

export default App