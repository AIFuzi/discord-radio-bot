export type radioStationKeys = 'jpop' | 'kpop' | 'anime'

type radioStationIdsMap = Record<
  radioStationKeys,
  { infoId: string; radioId: string } | null
>

export const RadioStation: radioStationIdsMap = {
  jpop: {
    infoId: '4b7216e7-1a82-49c5-a4e0-b47f237457d0',
    radioId: 'jpopradio',
  },
  anime: {
    infoId: '597342ce-46ad-4678-87ae-6d0717eb5eab',
    radioId: 'weebanimeradio',
  },
  kpop: {
    infoId: 'ad81329c-6783-443a-9647-fcca0223a028',
    radioId: 'kpopradio',
  },
} as const
