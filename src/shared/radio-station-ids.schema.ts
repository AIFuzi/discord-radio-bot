export const radioTypes = ['jpop', 'kpop', 'anime']

export type radioStationKeys = (typeof radioTypes)[number]

type radioStationMap = Record<
  radioStationKeys,
  { infoId: string; radioId: string; artwork: string; color?: number } | null
>

export const RadioStation: radioStationMap = {
  jpop: {
    infoId: '4b7216e7-1a82-49c5-a4e0-b47f237457d0',
    radioId: 'jpopradio',
    artwork:
      'https://ik.imagekit.io/boxradio/radios/if7vjTynWEAN4Q7iOrQxHWUhZBctNkEs8SSo3x3j.jpg',
    color: 14300502,
  },
  anime: {
    infoId: '597342ce-46ad-4678-87ae-6d0717eb5eab',
    radioId: 'weebanimeradio',
    artwork:
      'https://ik.imagekit.io/boxradio/radios/uec4MZkLSul6g63ifN3FKLlxlgptA22okrR45dUq.png',
    color: 12260882,
  },
  kpop: {
    infoId: 'ad81329c-6783-443a-9647-fcca0223a028',
    radioId: 'kpopradio',
    artwork:
      'https://ik.imagekit.io/boxradio/radios/XZxZczvnQ18CVrJsUNW0XjpWNJjDLZx1j5c5glLd.png',
    color: 16046030,
  },
} as const

export function isRadioStationKey(value: string): value is radioStationKeys {
  return radioTypes.some(k => k === value)
}
