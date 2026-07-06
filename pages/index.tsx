import letterboxd, { type Diary } from 'letterboxd-api'
import type { InferGetServerSidePropsType } from 'next'
import { Avatar } from '../components/avatar'
import BentoGrid, { type SpotifyData } from '../components/BentoGrid'
import { SocialIcons } from '../components/SocialIcons'

export default function Home({ film, checkInDetails, activity, spotify }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="mx-auto w-full max-w-[672px] px-4 pb-16 pt-12 md:px-6">
      <div className="flex items-center gap-4">
        <Avatar src="https://unavatar.io/github/sinchang" alt="Jeff Wen" width={56} height={56} />
        <div>
          <h1 className="text-lg font-semibold text-white">Jeff Wen</h1>
          <p className="text-white/45 text-sm">Software Engineer · Shanghai</p>
        </div>
      </div>
      <p className="mt-5 text-[15px] leading-relaxed text-white/60">
        I build for the web. Born in Cangnan, Wenzhou — living and working in Shanghai.
      </p>
      <SocialIcons />
      <BentoGrid film={film} checkInDetails={checkInDetails} activity={activity} spotify={spotify} />
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

  const [checkInRes, activitiesRes, spotifyRes] = await Promise.all([
    fetch('https://sinchang-checkin.web.val.run'),
    fetch('https://raw.githubusercontent.com/XChangLab/workouts_page/master/src/static/activities.json'),
    fetch('https://now-playing-profile-rho.vercel.app/now-playing?json'),
  ])

  const checkInDetails = await checkInRes.json()
  const activitiesData: Activity[] = await activitiesRes.json()

  const activity = activitiesData
    .filter(a => SUPPORTED_TYPES.includes(a.type.toLowerCase()))
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())[0] ?? null

  let spotify: SpotifyData | null = null
  if (spotifyRes.ok) {
    const spotifyJson = await spotifyRes.json()
    if (spotifyJson?.item && Object.keys(spotifyJson.item).length > 0) {
      spotify = {
        isPlaying: spotifyJson.isPlaying ?? false,
        trackName: spotifyJson.item.name,
        artistName: spotifyJson.item.artists?.[0]?.name ?? '',
        albumName: spotifyJson.item.album?.name ?? '',
        albumArt: spotifyJson.item.album?.images?.[2]?.url ?? spotifyJson.item.album?.images?.[0]?.url ?? '',
        trackUrl: spotifyJson.item.external_urls?.spotify ?? '',
        progress: spotifyJson.progress ?? 0,
        duration: spotifyJson.item.duration_ms,
      }
    }
  }

  return {
    props: {
      film: {
        uri: item?.uri,
        image: item?.film?.image?.large,
        ratingText: item.rating.text,
      },
      checkInDetails,
      activity,
      spotify,
    },
  }
}
