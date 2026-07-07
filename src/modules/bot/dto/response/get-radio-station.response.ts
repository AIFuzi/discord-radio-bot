type historyType = {
  song: string
  artist: string
  artwork: string
  timestamp: string
  relative_time: string
}

export type GetRadioStationResponse = {
  name: string
  bitrate: number
  format: string
  artist: string
  song: string
  album: string
  genre: string
  artwork: string
  year: number
  duration: number
  elapsed: number
  remaining: number
  time: string
  stream: string
  lyrics: string
  explicit: boolean
  songFound: boolean
  metadataFound: boolean
  history: historyType[]
}
