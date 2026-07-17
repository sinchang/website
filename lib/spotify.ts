export interface SpotifyData {
  isPlaying: boolean
  trackName: string
  artistName: string
  albumName: string
  albumArt: string
  trackUrl: string
  progress: number
  duration: number
}

export const NOW_PLAYING_URL = 'https://now-playing-profile-rho.vercel.app/now-playing?json'

export function mapSpotify(json: any): SpotifyData | null {
  if (!json?.item || Object.keys(json.item).length === 0)
    return null
  return {
    isPlaying: json.isPlaying ?? false,
    trackName: json.item.name,
    artistName: json.item.artists?.[0]?.name ?? '',
    albumName: json.item.album?.name ?? '',
    albumArt: json.item.album?.images?.[2]?.url ?? json.item.album?.images?.[0]?.url ?? '',
    trackUrl: json.item.external_urls?.spotify ?? '',
    progress: json.progress ?? 0,
    duration: json.item.duration_ms,
  }
}
