import type { NextApiRequest, NextApiResponse } from 'next'
import type { SpotifyData } from '../../lib/spotify'
import { mapSpotify, NOW_PLAYING_URL } from '../../lib/spotify'

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<SpotifyData | null>,
) {
  try {
    const upstream = await fetch(NOW_PLAYING_URL)
    if (!upstream.ok)
      return res.status(200).json(null)
    const json = await upstream.json()
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30')
    return res.status(200).json(mapSpotify(json))
  }
  catch {
    return res.status(200).json(null)
  }
}
