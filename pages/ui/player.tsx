import type { NextPage } from 'next'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useAudioPlayer } from 'react-use-audio-player'

function secondsToMinSecPadded(time: number): string {
  const minutes = Number(`${Math.floor(time / 60)}`.padStart(2, '0'))
  const seconds = `${(time - minutes * 60).toFixed(0)}`.padStart(2, '0')
  return `${minutes}:${seconds}`
}

const AUDIO_URL = 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/io/这个世界会好吗.mp3'

const PlayerPage: NextPage = () => {
  const { load, playing, play, pause, getPosition, duration } = useAudioPlayer()
  const frameRef = useRef<number>()
  const [pos, setPos] = useState(0)

  useEffect(() => {
    const animate = () => {
      setPos(getPosition())
      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = window.requestAnimationFrame(animate)

    return () => {
      if (frameRef.current)
        cancelAnimationFrame(frameRef.current)
    }
  }, [getPosition])

  useEffect(() => {
    load(AUDIO_URL)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mt-[30vh] flex justify-center">
      <div className='w-[400px] rounded-lg bg-slate-100 p-6 dark:bg-slate-800'>
        <div className='flex'>
          <Image src="https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/io/cover.png" width={80} height={80} alt='Now' className='rounded-lg' />
          <div className='ml-4 mt-2'>
            <h1>李志</h1>
            <h4 className='text-sm text-gray-500 dark:text-gray-300'>这个世界会好吗</h4>
          </div>
        </div>
        <div className='mt-4 flex items-center justify-around gap-4'>
          <div className='w-10'>{secondsToMinSecPadded(pos)}</div>
          <div className='h-[4px] flex-1 rounded-lg bg-slate-500 dark:bg-slate-100'>
            <div className='h-[4px] bg-slate-400' style={{
              width: `${(pos / duration) * 100}%`,
            }}></div>
          </div>
          <div className='w-10'>-{secondsToMinSecPadded(duration - pos)}</div>
        </div>
        <div className='mt-4 flex justify-center gap-8 text-center'>
          <span className='i-ri-skip-back-fill h-8 w-8'></span>
          {!playing
            ? <span className='i-ri-play-fill h-8 w-8 p-4' onClick={play}></span>
            : <span className='i-ri-pause-fill h-8 w-8' onClick={pause}></span>}
          <span className='i-ri-skip-forward-fill h-8 w-8'></span>
        </div>
      </div>
    </div>
  )
}

export default PlayerPage
