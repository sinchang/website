import letterboxd, { type Diary } from 'letterboxd-api'
import type { InferGetServerSidePropsType } from 'next'
import { Avatar } from '../components/avatar'
import BentoGrid from '../components/BentoGrid'
import { SocialIcons } from '../components/SocialIcons'

export default function Home({ film, checkInDetails, activity }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="mx-auto w-full max-w-[672px] gap-3 px-3 pb-8 pt-16 md:px-6">
      <Avatar src="https://unavatar.io/github/sinchang" alt="Jeff Wen" width={100} height={100} />
      <div className="my-6 text-xl">
        👋 I'm Jeff, a software engineer. I was born
        and raised in Cangnan, Wenzhou, now living in Shanghai.
      </div>
      <SocialIcons />
      <BentoGrid film={film} checkInDetails={checkInDetails} activity={activity} />
      {/* <div className='my-16 h-0.5 w-full bg-black dark:bg-white'></div>
      <div>
        <h1 className='pl-3 text-xl font-bold'>UI</h1>
        <ul className='mt-3'>
          {uiSnippets.map(ui => (
            <li key={ui.url} ><Link href={ui.url} className='block w-[100%] rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-800'>{ui.name}</Link></li>
          ))}
        </ul>
      </div>
      <div className='my-16 h-0.5 w-full bg-black dark:bg-white'></div>
      <div>
        <h1 className='pl-3 text-xl font-bold'>Projects</h1>
        <Projects />
      </div>
      <div className='my-16 h-0.5 w-full bg-black dark:bg-white'></div>
      <CheckIn /> */}
    </div>
  )
}

const SUPPORTED_TYPES = ['run', 'ride', 'walk', 'hike']

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

export async function getServerSideProps() {
  const items = await letterboxd('sinchang')
  const item = items?.[0] as Diary

  const [checkInRes, activitiesRes] = await Promise.all([
    fetch('https://sinchang-checkin.web.val.run'),
    fetch('https://raw.githubusercontent.com/XChangLab/workouts_page/master/src/static/activities.json'),
  ])

  const checkInDetails = await checkInRes.json()
  const activitiesData: Activity[] = await activitiesRes.json()

  const activity = activitiesData
    .filter(a => SUPPORTED_TYPES.includes(a.type.toLowerCase()))
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())[0] ?? null

  return {
    props: {
      film: {
        uri: item?.uri,
        image: item?.film?.image?.large,
        ratingText: item.rating.text,
      },
      checkInDetails,
      activity,
    },
  }
}
