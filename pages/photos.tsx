import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const PHOTOS = [
  {
    id: 1,
    src: 'https://picsum.photos/seed/shanghai1/800/600',
    caption: 'The Bund at dusk',
    location: 'Shanghai, China',
    date: 'May 2025',
    wide: true,
  },
  {
    id: 2,
    src: 'https://picsum.photos/seed/tokyo1/600/600',
    caption: 'Shibuya crossing',
    location: 'Tokyo, Japan',
    date: 'Mar 2025',
    wide: false,
  },
  {
    id: 3,
    src: 'https://picsum.photos/seed/kyoto1/600/600',
    caption: 'Fushimi Inari torii gates',
    location: 'Kyoto, Japan',
    date: 'Mar 2025',
    wide: false,
  },
  {
    id: 4,
    src: 'https://picsum.photos/seed/hike1/800/500',
    caption: 'Morning fog on the trail',
    location: 'Huangshan, Anhui',
    date: 'Oct 2024',
    wide: true,
  },
  {
    id: 5,
    src: 'https://picsum.photos/seed/city1/600/600',
    caption: 'Old city rooftops',
    location: 'Pingyao, Shanxi',
    date: 'Sep 2024',
    wide: false,
  },
  {
    id: 6,
    src: 'https://picsum.photos/seed/cafe1/600/600',
    caption: 'Afternoon light',
    location: 'Shanghai, China',
    date: 'Aug 2024',
    wide: false,
  },
  {
    id: 7,
    src: 'https://picsum.photos/seed/river1/800/500',
    caption: 'Li River mist',
    location: 'Guilin, Guangxi',
    date: 'Jul 2024',
    wide: true,
  },
  {
    id: 8,
    src: 'https://picsum.photos/seed/street1/600/600',
    caption: 'Night market',
    location: 'Chengdu, Sichuan',
    date: 'Jun 2024',
    wide: false,
  },
  {
    id: 9,
    src: 'https://picsum.photos/seed/park1/600/600',
    caption: 'Cherry blossom season',
    location: 'Wuhan, Hubei',
    date: 'Apr 2024',
    wide: false,
  },
]

type Photo = typeof PHOTOS[number]

function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')
        onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={photo.src.replace('/800/600', '/1600/1200').replace('/800/500', '/1600/1000').replace('/600/600', '/1200/1200')}
          alt={photo.caption}
          className="max-h-[85vh] max-w-[85vw] object-contain"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-sm font-medium text-white">{photo.caption}</p>
          <div className="mt-1 flex items-center gap-2 text-[12px] text-white/60">
            <span className="i-ri-map-pin-line h-3 w-3" />
            <span>{photo.location}</span>
            <span>·</span>
            <span>{photo.date}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/80 transition-colors hover:bg-black/70"
        >
          <span className="i-ri-close-line h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function Photos() {
  const [selected, setSelected] = useState<Photo | null>(null)

  return (
    <>
      <Head>
        <title>Photos — Jeff Wen</title>
      </Head>
      <div className="mx-auto w-full max-w-[672px] px-4 pb-16 pt-12 md:px-6">
        <div className="mb-8 flex items-center gap-3">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] text-gray-400 transition-colors hover:text-gray-700 dark:border-white/[0.08] dark:text-white/40 dark:hover:text-white/80"
          >
            <span className="i-ri-arrow-left-line h-4 w-4" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Photos</h1>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {PHOTOS.map(photo => (
            <div
              key={photo.id}
              onClick={() => setSelected(photo)}
              className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-black/[0.08] bg-gray-100 dark:border-white/[0.08] dark:bg-white/[0.04] ${photo.wide ? 'col-span-2 h-[280px]' : 'h-[220px]'}`}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-medium text-white">{photo.caption}</p>
                <div className="mt-1 flex items-center gap-2 text-[12px] text-white/60">
                  <span className="i-ri-map-pin-line h-3 w-3" />
                  <span>{photo.location}</span>
                  <span>·</span>
                  <span>{photo.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && <Lightbox photo={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
