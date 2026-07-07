import { StringOption } from 'necord'

import type { radioStationKeys } from '@/src/shared'

export class RadioStationDto {
  @StringOption({
    name: 'station-name',
    description: 'Get info by radio station name  ',
    required: true,
  })
  station: radioStationKeys
}
