import React from 'react'
import { MapCard } from './MapCard'

export function CheckIn(checkInDetails: {
  venue: string
  lat: string
  lng: string
  cc: string
  location: string
}) {
  return checkInDetails?.venue
    ? <div className='relative block h-full w-full overflow-hidden rounded-3xl' >
      <MapCard latitude={Number(checkInDetails.lat)} longitude={Number(checkInDetails.lng)} location={checkInDetails.location} />
    </div>
    : null
}
