import './App.css'
import { useEffect, useState } from 'react'
import ShowCard from './components/showCard'
import FormField from './components/formField'
import Message from './components/message'
import Modal from './components/modal'
import { pb } from '../pocketbase'
import { BsFillPlusCircleFill } from "react-icons/bs";
import { RiEditCircleFill } from "react-icons/ri";
import { IoCloseCircle } from "react-icons/io5";
import { format } from 'date-fns';

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
  const [message, setMessage] = useState(null);
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [editingShow, setEditingShow] = useState(null);

  useEffect(() => {
    loadShows()
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => { clearTimeout(timer) }
  }, [message])

  async function loadShows() {
    // fetch shows
    const showData = await pb.collection('shows').getList(1, 50, {
      $autoCancel: false,
      sort: '-date'
    });
    const { items } = showData;
    // console.log(showData);
    setShows(items);
  }

  function handleChange(e) {
    const { name, value, files, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : value
    }))
  }

  function openEditForm(show) {
    setEditingShow(show);
    setFormData({
      date: show.date.split(' ')[0],
      venue: show.venue,
      city: show.city,
      state: show.state,
      bands: show.bands,
      flyer: null
    });
    setSelectedShow(null);
    setFormIsOpen(true);
  }

  async function deleteShow(show) {
    await pb.collection('shows').delete(show.id)
    setSelectedShow(null);
    loadShows();
  }

  async function submitShow(event) {
    event.preventDefault();
    try {
      if (editingShow) {
        const updateData = Object.fromEntries(
          Object.entries(formData).filter(([key, value]) => value !== null && value !== "")
        )
        const record = await pb.collection('shows').update(editingShow.id, updateData);
        setEditingShow(null);
        setMessage({ text: "Success, your show has been updated", type: "success" });
        loadShows();
      } else {
        const record = await pb.collection('shows').create(formData);
        setMessage({ text: "Success! The show has been added.", type: "success" });
        loadShows();
        setFormData(initialFormData);
      }
    } catch (err) {
      // console.error("failed to create", err);
      setMessage({ text: `Error: Something went wrong, please try again. ${err}`, type: "error" });
    }
  }

  return (
    <>
      <nav className="nav container">
        <div className="nav">
          <h1>Tour Diary</h1>
          <button>
            <BsFillPlusCircleFill size={40} onClick={() => {
              setEditingShow(null);
              setFormData(initialFormData);
              setFormIsOpen(true)
            }} />
          </button>
        </div>
      </nav>


      <div className="shows container">
        <div className="shows-grid">
          {shows.map(show => <ShowCard key={show.id} onClick={() => { setSelectedShow(show) }} {...show} />)}
        </div>
      </div>


      {formIsOpen && <Modal onClose={setFormIsOpen}>
        <h2>{editingShow ? "Edit Show" : "Add Show"}</h2>
        <form className="show-form" method="post" encType='multipart/form-data'>
          <FormField name="date" type="date" value={formData.date} onChange={handleChange} />
          <FormField placeholder="Ex: Bridgestone Arena" name="venue" type="text" value={formData.venue} onChange={handleChange} />
          <FormField placeholder="Ex: Nashville" name="city" type="text" value={formData.city} onChange={handleChange} />
          <FormField placeholder="Ex: TN" name="state" type="text" value={formData.state} onChange={handleChange} />
          <FormField placeholder="Start new line for each band" name="bands" type="textarea" value={formData.bands} rows="5" cols="30" onChange={handleChange} />
          <FormField name="flyer" type="file" onChange={handleChange} />
          {message && <Message message={message} />}
          <button type="submit" onClick={submitShow}>Upload</button>
        </form>
      </Modal>}

      {selectedShow && (
        <Modal onClose={setSelectedShow}>
          <div className="show-modal">
            <img src={pb.files.getURL({ id: selectedShow.id, collectionId: selectedShow.collectionId }, selectedShow.flyer)} />
            <div className='show-modal-title'>
              <h2>{selectedShow.venue}</h2>
              <button className='button-invisible' onClick={() => openEditForm(selectedShow)}>
                <RiEditCircleFill size={40} />
              </button>
              <button className="button-invisible" onClick={() => deleteShow(selectedShow)}>
                <IoCloseCircle size={42} />
              </button>
            </div>
            <p>{selectedShow.city}, {selectedShow.state}</p>
            <p>{format(new Date(selectedShow.date), "MM/dd/yyyy")}</p>
            {selectedShow.bands.split("\r\n").map((band, i, arr) => {
              return <span key={i}>{band}{(i + 1 !== arr.length ? ", " : "")}</span>
            })}
          </div>
        </Modal>
      )}
    </>
  )
}

export default App