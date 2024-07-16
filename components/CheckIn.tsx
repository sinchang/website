import React, { useEffect, useState } from 'react'
import countryCodeToFlagEmoji from 'country-code-to-flag-emoji'

export function CheckIn() {
  const [checkInDetails, setCheckInDetails] = useState<{
    name: string
    latitude: string
    longitude: string
    cc: string
  }>({ name: '', latitude: '', longitude: '', cc: '' })

  useEffect(() => {
    fetch('https://my-swarm.vercel.app/checkins.json?sql=select%20json_object(%27name%27%2C%20venues.name%2C%27country%27%2C%20venues.country%2C%27latitude%27%2C%20venues.latitude%2C%27longitude%27%2C%20venues.longitude%2C%27cc%27%2C%20venues.cc)%20from%20checkins%20INNER%20JOIN%20venues%20ON%20venues.id%3Dcheckins.venue%20order%20by%20created%20desc%20limit%201%3B')
      .then(res => res.json())
      .then((data) => {
        const checkInDetails = JSON.parse(data.rows[0])

        setCheckInDetails(checkInDetails)
      })
  }, [])

  return checkInDetails?.name
    ? <div className='text-sm'>
      <span>Last Swarm Check-in: </span>
      <a href={`https://www.google.com/maps/place/${checkInDetails.latitude}+${checkInDetails.longitude}`}>{countryCodeToFlagEmoji(checkInDetails.cc)} {checkInDetails?.name}</a></div>
    : null
}
