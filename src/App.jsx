import { useEffect, useState } from 'react'
import ShowCard from './components/showCard'
import './App.css'
import { supabase } from './createClient'

function App() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    console.log(supabase);
    loadShows()
  }, []);

  async function loadShows() {
    const { data, error } = await supabase
      .from('shows')
      .select()

    if (error) {
      console.error(error);
    } else {
      setShows(data);
    }

    console.log('shows', shows);
  }

  async function uploadPhoto(event) {
    event.preventDefault();
    const formData = new FormData(event.target.form);

    console.log(formData.entries)
    // const avatarFile = event.target.files[0]
    // const { data, error } = await supabase
    //   .storage
    //   .from('avatars')
    //   .upload('public/avatar1.png', avatarFile, {
    //     cacheControl: '3600',
    //     upsert: false
    //   })
  }

  return (
    <>
      <h1>Tour Diary</h1>

      <form method="post" encType='multipart/form-data'>
        <input type="file" name="file" id="file" />
        <button type="submit" onClick={uploadPhoto}>Upload</button>
      </form>

      {/* {shows.map(show, idx => {
        return <ShowCard {...show} />
      })} */}

    </>
  )
}

export default App