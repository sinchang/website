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
  }, [])

  return (
    <div className="flex mt-[30vh] justify-center">
      <div className='rounded-lg p-6 dark:bg-slate-800 bg-slate-500 bg-opacity-10 w-[400px]'>
        <div className='flex'>
          <Image src="https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/io/cover.png" width={80} height={80} alt='Now' className='rounded-lg' />
          <div className='ml-4 mt-2'>
            <h1>李志</h1>
            <h4 className='text-sm dark:text-gray-300 text-gray-500'>这个世界会好吗</h4>
          </div>
        </div>
        <div className='flex justify-around gap-4 items-center mt-4'>
          <div className='w-10'>{secondsToMinSecPadded(pos)}</div>
          <div className='dark:bg-slate-100 bg-slate-500 h-[4px] rounded-lg flex-1'>
            <div className='bg-slate-400 h-[4px]' style={{
              width: `${(pos / duration) * 100}%`,
            }}></div>
          </div>
          <div className='w-10'>-{secondsToMinSecPadded(duration - pos)}</div>
        </div>
        <div className='mt-4 text-center flex justify-center gap-8'>
          <span className='i-ri-skip-back-fill w-8 h-8'></span>
          {!playing
            ? <span className='i-ri-play-fill w-8 h-8 p-4' onClick={play}></span>
            : <span className='i-ri-pause-fill w-8 h-8' onClick={pause}></span>}
          <span className='i-ri-skip-forward-fill w-8 h-8'></span>
        </div>
      </div>
    </div>
  )
}

export default PlayerPage
