import type { SpotifyData } from '../lib/spotify'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const POLL_MS = 30_000
const TICK_MS = 1_000

export function SpotifyCard({ initial }: { initial: SpotifyData | null }) {
  const [data, setData] = useState(initial)

  // Re-sync with the API on mount and every 30s.
  useEffect(() => {
    let cancelled = false
    const refresh = async () => {
      try {
        const res = await fetch('/api/now-playing')
        if (!res.ok)
          return
        const fresh: SpotifyData | null = await res.json()
        if (!cancelled && fresh)
          setData(fresh)
      }
      catch {}
    }
    refresh()
    const id = setInterval(refresh, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  // Advance the progress bar locally between polls while playing.
  useEffect(() => {
    if (!data?.isPlaying)
      return
    const id = setInterval(() => {
      setData(d => d?.isPlaying
        ? { ...d, progress: Math.min(d.progress + TICK_MS, d.duration) }
        : d)
    }, TICK_MS)
    return () => clearInterval(id)
  }, [data?.isPlaying])

  if (!data)
    return null

  return (
    <a
      href={data.trackUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="col-span-2 flex items-center gap-4 overflow-hidden rounded-3xl border border-black/[0.08] bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-white/[0.12] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl shadow-lg">
        <Image
          src={data.albumArt}
          alt={data.albumName}
          width={64}
          height={64}
          className="size-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-1.5">
          {data.isPlaying
            ? <span className="size-1.5 animate-pulse rounded-full bg-[#1DB954]" />
            : <span className="size-1.5 rounded-full bg-gray-300 dark:bg-white/20" />}
          <p className="text-[length:10px] tracking-widest text-gray-400 uppercase dark:text-white/30">
            {data.isPlaying ? 'Now Playing' : 'Last Played'}
          </p>
        </div>
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{data.trackName}</p>
        <p className="truncate text-[length:13px] text-gray-500 dark:text-white/50">{data.artistName}</p>
        <p className="truncate text-[length:12px] text-gray-400 dark:text-white/25">{data.albumName}</p>
        {data.isPlaying && (
          <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-[#1DB954]"
              style={{ width: `${(data.progress / data.duration) * 100}%` }}
            />
          </div>
        )}
      </div>
    </a>
  )
}
