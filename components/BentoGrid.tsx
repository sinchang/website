import type { SpotifyData } from '../lib/spotify'
import dynamic from 'next/dynamic'
import React from 'react'
import { ActivityMap } from './ActivityMap'
import { CheckIn } from './CheckIn'
import { SpotifyCard } from './SpotifyCard'

const CheckinsGlobe = dynamic(
  () => import('./CheckinsGlobe').then(m => m.CheckinsGlobe),
  { ssr: false },
)

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

export default function BentoGrid({ film, checkInDetails, activity, spotify, checkinMarkers, checkinCountryCount }: {
  film: {
    image: string | null
    uri: string | null
    ratingText: string | null
  } | null
  checkInDetails: {
    venue: string
    lat: string
    lng: string
    cc: string
    location: string
  } | null
  activity: Activity | null
  spotify: SpotifyData | null
  checkinMarkers: [number, number][]
  checkinCountryCount: number
}) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">

      {/* Film card — always dark since it's a poster with a gradient overlay */}
      {film
        ? (
            <a
              href={film.uri?.replace('sinchang', '')}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex h-60 flex-col overflow-hidden rounded-3xl border border-black/[0.08] bg-gray-100 dark:border-white/[0.08] dark:bg-[rgb(18,13,30)]"
            >
              {film.image && (
                <img
                  src={film.image}
                  alt="Now watching"
                  className="absolute inset-0 size-full object-cover opacity-80"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="mb-1 text-[10px] tracking-widest text-white/[0.35] uppercase">Watching</p>
                <p className="text-sm font-semibold text-white">{film.ratingText}</p>
              </div>
            </a>
          )
        : (
            <div className="flex h-60 items-center justify-center rounded-3xl border border-black/[0.08] bg-gray-50 dark:border-white/[0.08] dark:bg-white/[0.04]">
              <span className="text-sm text-gray-400 dark:text-white/25">No recent film</span>
            </div>
          )}

      {/* Check-in map */}
      <div className="h-60 overflow-hidden rounded-3xl border border-black/[0.08] dark:border-white/[0.08]">
        {checkInDetails?.venue
          ? <CheckIn {...checkInDetails} />
          : (
              <div className="flex h-full items-center justify-center rounded-3xl bg-gray-50 dark:bg-white/[0.04]">
                <span className="text-sm text-gray-400 dark:text-white/25">No recent check-in</span>
              </div>
            )}
      </div>

      {/* Activity route map */}
      {activity?.summary_polyline && (
        <div className="relative col-span-2 h-70 overflow-hidden rounded-3xl border border-black/[0.08] dark:border-white/[0.08]">
          <ActivityMap polyline={activity.summary_polyline} />
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between overflow-hidden rounded-2xl bg-white/90 px-4 py-3 backdrop-blur-md dark:bg-black/60">
            <div className="flex min-w-0 items-center gap-2 text-[13px]">
              <span className="font-semibold text-gray-900 dark:text-white">
                {TYPE_LABELS[activity.type] ?? activity.type}
              </span>
              <span className="text-gray-300 dark:text-white/20">·</span>
              <span className="truncate text-gray-500 dark:text-white/60">{activity.name}</span>
            </div>
            <div className="ml-4 flex shrink-0 items-center gap-3 text-[13px] text-gray-400 dark:text-white/40">
              <span>
                {(activity.distance / 1000).toFixed(2)}
                {' '}
                km
              </span>
              {activity.elevation_gain > 0 && (
                <>
                  <span className="text-gray-300 dark:text-white/20">·</span>
                  <span>
                    ↑
                    {Math.round(activity.elevation_gain)}
                    {' '}
                    m
                  </span>
                </>
              )}
              <span className="text-gray-300 dark:text-white/20">·</span>
              <span>{activity.moving_time}</span>
            </div>
          </div>
        </div>
      )}

      {/* Checkins globe */}
      {checkinMarkers.length > 0 && (
        <CheckinsGlobe markers={checkinMarkers} count={checkinMarkers.length} countryCount={checkinCountryCount} />
      )}

      {/* Spotify now-playing — hydrates from ISR data, then polls /api/now-playing */}
      <SpotifyCard initial={spotify} />

    </div>
  )
}
