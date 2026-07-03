import Image from 'next/image'
import React from 'react'
import { CheckIn } from './CheckIn'
import { ActivityMap } from './ActivityMap'

interface Activity {
  run_id: number
  name: string
  distance: number
  moving_time: string
  type: string
  start_date: string
  summary_polyline: string
  elevation_gain: number
}

const TYPE_LABELS: Record<string, string> = {
  Run: 'Run',
  Ride: 'Ride',
  Walk: 'Walk',
  Hike: 'Hike',
}

export default function BentoGrid({ film, checkInDetails, activity }: {
  film: {
    image: string | undefined
    uri: string
    ratingText: string
  }
  checkInDetails: {
    venue: string
    lat: string
    lng: string
    cc: string
    location: string
  }
  activity: Activity | null
}) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">

      {/* Film card — left column */}
      <a
        href={film?.uri?.replace('sinchang', '')}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-[220px] flex-col overflow-hidden rounded-2xl bg-[rgb(18,13,30)]"
      >
        {film?.image && (
          <img
            src={film.image}
            alt="Now watching"
            className="absolute inset-0 h-full w-full object-cover opacity-75"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="mb-0.5 text-[10px] uppercase tracking-widest text-white/40">Watching</p>
          <p className="text-sm font-medium text-white">{film?.ratingText}</p>
        </div>
      </a>

      {/* Check-in map — right column */}
      <div className="h-[220px] overflow-hidden rounded-2xl">
        {checkInDetails?.venue
          ? <CheckIn {...checkInDetails} />
          : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
              <span className="text-sm text-white/25">No recent check-in</span>
            </div>
            )}
      </div>

      {/* Activity route map — full width */}
      {activity?.summary_polyline && (
        <div className="relative col-span-2 h-[280px] overflow-hidden rounded-2xl">
          <ActivityMap polyline={activity.summary_polyline} />
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between overflow-hidden rounded-xl bg-black/50 px-4 py-2.5 backdrop-blur-md">
            <div className="flex min-w-0 items-center gap-2 text-[13px]">
              <span className="font-semibold text-white">
                {TYPE_LABELS[activity.type] ?? activity.type}
              </span>
              <span className="text-white/25">·</span>
              <span className="truncate text-white/60">{activity.name}</span>
            </div>
            <div className="ml-4 flex shrink-0 items-center gap-2 text-[13px] text-white/40">
              <span>{(activity.distance / 1000).toFixed(2)} km</span>
              <span className="text-white/20">·</span>
              <span>{activity.moving_time}</span>
            </div>
          </div>
        </div>
      )}

      {/* Spotify now-playing — full width */}
      <div className="col-span-2 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] backdrop-blur-sm">
        <a
          href="https://now-playing-profile-rho.vercel.app/now-playing?open"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="https://now-playing-profile-rho.vercel.app/now-playing"
            alt="Now Playing on Spotify"
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full"
            unoptimized
          />
        </a>
      </div>

    </div>
  )
}
