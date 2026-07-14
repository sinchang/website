import Image from 'next/image'
import dynamic from 'next/dynamic'
import React from 'react'
import { CheckIn } from './CheckIn'
import { ActivityMap } from './ActivityMap'

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

export interface SpotifyData {
  isPlaying: boolean
  trackName: string
  artistName: string
  albumName: string
  albumArt: string
  trackUrl: string
  progress: number
  duration: number
}

const TYPE_LABELS: Record<string, string> = {
  Run: 'Run',
  Ride: 'Ride',
  Walk: 'Walk',
  Hike: 'Hike',
}

export default function BentoGrid({ film, checkInDetails, activity, spotify, checkinMarkers, checkinCountryCount }: {
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
  spotify: SpotifyData | null
  checkinMarkers: [number, number][]
  checkinCountryCount: number
}) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">

      {/* Film card */}
      <a
        href={film?.uri?.replace('sinchang', '')}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-[240px] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[rgb(18,13,30)]"
      >
        {film?.image && (
          <img
            src={film.image}
            alt="Now watching"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="mb-1 text-[10px] uppercase tracking-widest text-white/35">Watching</p>
          <p className="text-sm font-semibold text-white">{film?.ratingText}</p>
        </div>
      </a>

      {/* Check-in map */}
      <div className="h-[240px] overflow-hidden rounded-3xl border border-white/[0.08]">
        {checkInDetails?.venue
          ? <CheckIn {...checkInDetails} />
          : (
            <div className="flex h-full items-center justify-center rounded-3xl border border-white/[0.12] bg-white/[0.04]">
              <span className="text-sm text-white/25">No recent check-in</span>
            </div>
            )}
      </div>

      {/* Activity route map */}
      {activity?.summary_polyline && (
        <div className="relative col-span-2 h-[280px] overflow-hidden rounded-3xl border border-white/[0.08]">
          <ActivityMap polyline={activity.summary_polyline} />
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between overflow-hidden rounded-2xl bg-black/60 px-4 py-3 backdrop-blur-md">
            <div className="flex min-w-0 items-center gap-2 text-[13px]">
              <span className="font-semibold text-white">
                {TYPE_LABELS[activity.type] ?? activity.type}
              </span>
              <span className="text-white/20">·</span>
              <span className="truncate text-white/60">{activity.name}</span>
            </div>
            <div className="ml-4 flex shrink-0 items-center gap-3 text-[13px] text-white/40">
              <span>{(activity.distance / 1000).toFixed(2)} km</span>
              {activity.elevation_gain > 0 && (
                <>
                  <span className="text-white/20">·</span>
                  <span>↑ {Math.round(activity.elevation_gain)} m</span>
                </>
              )}
              <span className="text-white/20">·</span>
              <span>{activity.moving_time}</span>
            </div>
          </div>
        </div>
      )}

      {/* Checkins globe */}
      {checkinMarkers.length > 0 && (
        <CheckinsGlobe markers={checkinMarkers} count={checkinMarkers.length} countryCount={checkinCountryCount} />
      )}

      {/* Spotify now-playing */}
      {spotify && (
        <a
          href={spotify.trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2 flex items-center gap-4 overflow-hidden rounded-3xl border border-white/[0.12] bg-white/[0.06] p-4 backdrop-blur-sm transition-colors hover:bg-white/[0.10]"
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl shadow-lg">
            <Image
              src={spotify.albumArt}
              alt={spotify.albumName}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-1.5">
              {spotify.isPlaying
                ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1DB954]" />
                : <span className="h-1.5 w-1.5 rounded-full bg-white/20" />}
              <p className="text-[10px] uppercase tracking-widest text-white/30">
                {spotify.isPlaying ? 'Now Playing' : 'Last Played'}
              </p>
            </div>
            <p className="truncate text-sm font-semibold text-white">{spotify.trackName}</p>
            <p className="truncate text-[13px] text-white/50">{spotify.artistName}</p>
            <p className="truncate text-[12px] text-white/25">{spotify.albumName}</p>
            {spotify.isPlaying && (
              <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#1DB954]"
                  style={{ width: `${(spotify.progress / spotify.duration) * 100}%` }}
                />
              </div>
            )}
          </div>
        </a>
      )}

    </div>
  )
}
