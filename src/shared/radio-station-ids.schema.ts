import {
  AnimeStation,
  jpcityStation,
  jpopStation,
  KpopStation,
  RockStation,
} from '@/src/shared/stations'

export const radioTypes = ['jpop', 'kpop', 'anime', 'japancity', 'rock']

export type radioStationKeys = (typeof radioTypes)[number]

type radioStationMap = Record<
  radioStationKeys,
  {
    infoId: string
    radioId: string
    artwork: string
    color?: number
  } | null
>

export const RadioStation: radioStationMap = {
  jpop: jpopStation,
  anime: AnimeStation,
  kpop: KpopStation,
  japancity: jpcityStation,
  rock: RockStation,
} as const

export function isRadioStationKey(value: string): value is radioStationKeys {
  return radioTypes.some(k => k === value)
}
