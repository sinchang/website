import { AnimatedNumber } from './animatedNumber'

interface SwarmInfoProps {
  checkInCount: number
  placeCount: number
  countryCount: number
}

export function SwarmInfo({ checkInCount = 0, placeCount = 0, countryCount = 0 }: SwarmInfoProps) {
  return <div className='fixed left-4 top-4 z-10 text-sm text-slate-200'>A map of places I've checked in on Earth.<br></br> <span className='text-4xl text-white'>
    <AnimatedNumber value={checkInCount}/>
    </span> check-ins<br></br><span className='text-4xl text-white'>

    <AnimatedNumber value={placeCount}/>
    </span> places <br></br><span className='text-4xl text-white'>
    <AnimatedNumber value={countryCount}/>
    </span> countries </div>
}
