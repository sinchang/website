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
    ? <div>
        <h1 className='pl-3 text-xl font-bold'>Last seen at:</h1>
        <a href={`https://www.google.com/maps/place/${checkInDetails.lat}+${checkInDetails.lng}`}>
          <div className='relative my-4 block h-[300px] w-[300px] overflow-hidden rounded-3xl' >
            <MapCard latitude={Number(checkInDetails.lat)} longitude={Number(checkInDetails.lng)} location={checkInDetails.location} />
          </div>
        </a>
      </div>
    : null
}
