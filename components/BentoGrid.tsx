import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { CheckIn } from './CheckIn'
import { ActivityMap } from './ActivityMap'

const ReactGridLayout = WidthProvider(Responsive)

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
  const layouts = {
    lg: [
      { i: 'a', x: 0, y: 0, w: 2, h: 2 },
      { i: 'b', x: 3, y: 1, w: 2, h: 2 },
      ...(activity?.summary_polyline ? [{ i: 'c', x: 0, y: 2, w: 4, h: 2 }] : []),
    ],
  }

  return (
    <ReactGridLayout
      layouts={layouts}
      cols={{ lg: 4, xs: 4, xxs: 1 }}
      margin={[15, 15]}
      rowHeight={150}
      isDraggable={false}
      isResizable={false}
    >
      <div key="a">
        <CheckIn {...checkInDetails} />
      </div>
      <div key="b" className="relative h-full max-w-[624px] overflow-hidden rounded-3xl border p-6 shadow-md" style={{
        backgroundColor: 'rgb(29, 24, 44)',
        borderColor: 'rgb(64, 58, 85)',
      }}>
        <a href={film?.uri?.replace('sinchang', '')} target="_blank">
          <div className='flex h-full w-full flex-col items-center justify-between gap-4'>
            <img src={film?.image} className="h-4/5" />
            <div>{film?.ratingText}</div>
          </div>
        </a>
      </div>
      {activity?.summary_polyline && (
        <div key="c" className="relative h-full w-full overflow-hidden rounded-3xl">
          <ActivityMap polyline={activity.summary_polyline} />
          <div className='absolute bottom-2 left-[50%] z-10 translate-x-[-50%] whitespace-nowrap rounded-[8px] bg-white/70 px-3 py-1.5 text-[14px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06)] backdrop-blur-[20px]'>
            <div className='flex items-center gap-2 text-black'>
              <span className='font-medium'>{TYPE_LABELS[activity.type] ?? activity.type}</span>
              <span className='text-gray-400'>·</span>
              <span className='line-clamp-1 max-w-[180px]'>{activity.name}</span>
              <span className='text-gray-400'>·</span>
              <span>{(activity.distance / 1000).toFixed(2)} km</span>
              <span className='text-gray-400'>·</span>
              <span>{activity.moving_time}</span>
            </div>
          </div>
        </div>
      )}
    </ReactGridLayout>
  )
}
