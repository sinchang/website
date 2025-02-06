import GridLayout, { WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { CheckIn } from './CheckIn'

const ReactGridLayout = WidthProvider(GridLayout)

const layout = [
  { i: 'a', x: 0, y: 0, w: 2, h: 2 },
  { i: 'b', x: 3, y: 1, w: 2, h: 2 },
]

export default function BentoGrid({ film, checkInDetails }: { film: {
  image: string | undefined
  uri: string
  ratingText: string
}, checkInDetails: {
  venue: string
  lat: string
  lng: string
  cc: string
  location: string
} }) {
  return (
        <ReactGridLayout
          layout={layout}
          cols={4}
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
            <img src={film?.image} className="h-4/5"/>
            <div>{film?.ratingText}</div>
          </div>
          </a>
         </div>
        </ReactGridLayout>
  )
}
