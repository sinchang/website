import React, { useEffect, useState } from 'react'
import { MapCard } from './MapCard'

export function CheckIn() {
  const [checkInDetails, setCheckInDetails] = useState<{
    venue: string
    lat: string
    lng: string
    cc: string
    location: string
  }>({ venue: '', lat: '', lng: '', cc: '', location: '' })

  useEffect(() => {
    fetch('https://sinchang-checkin.web.val.run')
      .then(res => res.json())
      .then((data) => {
        setCheckInDetails(data)
      })
  }, [])

  // return checkInDetails?.name
  //   ? <div className='text-sm'>
  //     <span>Last seen at: </span>
  //     <a href={`https://www.google.com/maps/place/${checkInDetails.latitude}+${checkInDetails.longitude}`}>{countryCodeToFlagEmoji(checkInDetails.cc)} {checkInDetails?.name}</a></div>
  //   : null

  return checkInDetails?.venue
    ? <div className='relative block h-full w-full overflow-hidden rounded-3xl' >
            <MapCard latitude={Number(checkInDetails.lat)} longitude={Number(checkInDetails.lng)} location={checkInDetails.location} />
          </div>
    : null
}
