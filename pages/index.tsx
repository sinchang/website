import path from 'node:path'
import process from 'node:process'
import letterboxd, { type Diary } from 'letterboxd-api'
import type { InferGetServerSidePropsType } from 'next'
import { Avatar } from '../components/avatar'
import BentoGrid, { type SpotifyData } from '../components/BentoGrid'
import { SocialIcons } from '../components/SocialIcons'
import { ToggleTheme } from '../components/ToggleTheme'

export default function Home({ film, checkInDetails, activity, spotify, checkinMarkers, checkinCountryCount }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="mx-auto w-full max-w-[672px] px-4 pb-16 pt-12 md:px-6">
      <div className="flex items-center gap-4">
        <Avatar src="https://unavatar.io/github/sinchang" alt="Jeff Wen" width={64} height={64} className="ring-2 ring-black/10 dark:ring-white/10" />
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Jeff Wen</h1>
          <p className="text-sm text-gray-500 dark:text-white/40">Software Engineer · Shanghai</p>
        </div>
        <div className="ml-auto">
          <ToggleTheme />
        </div>
      </div>
      <p className="mt-5 text-base leading-relaxed text-gray-600 dark:text-white/60">
        I build for the web. Born in Cangnan, Wenzhou — living and working in Shanghai.
      </p>
      <SocialIcons />
      <BentoGrid film={film} checkInDetails={checkInDetails} activity={activity} spotify={spotify} checkinMarkers={checkinMarkers} checkinCountryCount={checkinCountryCount} />
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

interface CheckinData {
  markers: [number, number][]
  countryCount: number
}

async function fetchCheckinMarkers(): Promise<CheckinData> {
  try {
    const res = await fetch('https://my-swarm.fly.dev/checkins.db')
    if (!res.ok)
      return { markers: [], countryCount: 0 }
    const buffer = await res.arrayBuffer()
    const initSqlJs = (await import('sql.js')).default
    const SQL = await initSqlJs({
      locateFile: file => path.resolve(process.cwd(), 'public', file),
    })
    const db = new SQL.Database(new Uint8Array(buffer))

    const tables = db.exec('SELECT name FROM sqlite_master WHERE type=\'table\'')
    const tableName = tables[0]?.values?.[0]?.[0] as string | undefined
    if (!tableName) { db.close(); return { markers: [], countryCount: 0 } }

    const schemaResult = db.exec(`PRAGMA table_info(${tableName})`)
    const columns = (schemaResult[0]?.values ?? []).map(row => row[1] as string)

    const latCol = columns.find(c => /^lat/i.test(c))
    const lngCol = columns.find(c => /^l(ng|on)/i.test(c))
    if (!latCol || !lngCol) { db.close(); return { markers: [], countryCount: 0 } }

    const ccCol = columns.find(c => /^(cc|country)/i.test(c))

    const result = db.exec(
      `SELECT ${latCol}, ${lngCol}${ccCol ? `, ${ccCol}` : ''} FROM ${tableName} WHERE ${latCol} IS NOT NULL AND ${lngCol} IS NOT NULL`,
    )
    db.close()

    const rows = result[0]?.values ?? []
    const markers = rows.map(row => [Number(row[0]), Number(row[1])]) as [number, number][]
    const countryCount = ccCol
      ? new Set(rows.map(row => row[2]).filter(Boolean)).size
      : 0

    return { markers, countryCount }
  }
  catch {
    return { markers: [], countryCount: 0 }
  }
}

export async function getServerSideProps() {
  const items = await letterboxd('sinchang')
  const item = items?.[0] as Diary

  const [checkInRes, activitiesRes, spotifyRes, checkinData] = await Promise.all([
    fetch('https://sinchang-checkin.web.val.run'),
    fetch('https://raw.githubusercontent.com/XChangLab/workouts_page/master/src/static/activities.json'),
    fetch('https://now-playing-profile-rho.vercel.app/now-playing?json'),
    fetchCheckinMarkers(),
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
      checkinMarkers: checkinData.markers,
      checkinCountryCount: checkinData.countryCount,
    },
  }
}
