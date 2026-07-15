import { useEffect, useState } from 'react'
import ShowCard from '../components/showCard'
import TourCard from '../components/tourCard'
import { pb } from '../../pocketbase'

export default function Home() {
  const [shows, setShows] = useState([])

  useEffect(() => {
    async function load() {
      const showData = await pb.collection('shows').getList(1, 50, { $autoCancel: false, sort: '-date' })
      const tourData = await pb.collection('tours').getList(1, 50, { $autoCancel: false, sort: '-year' })
      setShows([...tourData.items, ...showData.items])
    }
    load()
  }, [])

  return (
    <div className="shows container">
      <div className="shows-grid">
        {shows.map((show, index) => show.collectionName === 'tours'
          ? <TourCard key={show.id} {...show} priority={index < 6} />
          : <ShowCard key={show.id} {...show} priority={index < 6} />
        )}
      </div>
    </div>
  )
}
