type keys = 'jpop' | 'kpop' | 'anime'

type radioStationIdsMap = Record<keys, string | null>

export const RadioStation: radioStationIdsMap = {
  jpop: '4b7216e7-1a82-49c5-a4e0-b47f237457d0',
  anime: '597342ce-46ad-4678-87ae-6d0717eb5eab',
  kpop: null,
}
