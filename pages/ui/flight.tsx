import type { NextPage } from 'next'

const FlightPage: NextPage = () => {
  return (
   <div className='mt-10 flex items-center justify-center'>
     <div className='w-[400px] rounded-lg bg-slate-100 p-4 dark:bg-slate-800'>
      <div className='flex items-center justify-between'>
        <span>DEPARTURE: 22:10 PM</span>
        <span>ARRIVAL: 02:25 AM</span>
      </div>
      <div className='mt-2 flex items-center justify-between'>
        <div className='flex flex-col items-start'>
          <span className='text-2xl font-bold'>XMN</span>
          <span className='text-sm'>Xiamen</span>
        </div>
        <div className='mx-4 flex flex-1 items-center justify-center'>
          <span className='bottom-2 h-1 flex-1 border-b-2 border-dashed'></span>
          <span className="i-ri-flight-takeoff-fill h-6 w-6 px-6"></span>
          <span className='bottom-2 h-1 flex-1 border-b-2 border-dashed'></span>
        </div>
        <div className='flex flex-col items-end'>
          <span>SIN</span>
          <span className='text-sm'>Singapore</span>
        </div>
      </div>
      <div className='mt-2 flex items-center'>
        <span className='flex-1 border-b-[1px]'></span>
        <div className='px-2'>Total 4h 15 m</div>
        <span className='flex-1 border-b-[1px]'></span>
      </div>
    </div>
   </div>
  )
}

export default FlightPage
