import letterboxd, { type Diary } from 'letterboxd-api'
import type { InferGetServerSidePropsType } from 'next'
import { Avatar } from '../components/avatar'
import BentoGrid from '../components/BentoGrid'
import { SocialIcons } from '../components/SocialIcons'

export default function Home({ film, checkInDetails, activity }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="mx-auto w-full max-w-[672px] px-4 pb-16 pt-12 md:px-6">
      <div className="flex items-center gap-4">
        <Avatar src="https://unavatar.io/github/sinchang" alt="Jeff Wen" width={56} height={56} />
        <div>
          <h1 className="text-lg font-semibold text-white">Jeff Wen</h1>
          <p className="text-sm text-white/45">Software Engineer · Shanghai</p>
        </div>
      </div>
      <p className="mt-5 text-[15px] leading-relaxed text-white/60">
        I build for the web. Born in Cangnan, Wenzhou — living and working in Shanghai.
      </p>
      <SocialIcons />
      <BentoGrid film={film} checkInDetails={checkInDetails} activity={activity} />
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
