import React from 'react'
import { format } from 'date-fns'

export default function showCard({ venue_name, location, bands, date }) {
  return (
    <div className='showCard'>
      <img src="https://qckfxeirvfdxwlrdweyx.supabase.co/storage/v1/object/public/show-flyers/416514176_238080592673115_8954636131254631778_n.jpg" alt="" />
      <h2>{venue_name}</h2>
      <p>{location}</p>
      <p>{format(new Date(date), "MM/dd/yyyy")}</p>
      <ul>
        {bands.map(band => {
          return <li key={band.toLowerCase()}>{band}</li>
        })}
      </ul>
    </div>
  )
}
