import { StringOption } from 'necord'

import type { radioStationKeys } from '@/src/shared'

export class GetMetadataDto {
  @StringOption({
    name: 'station-name',
    description: 'Get info by radio station name  ',
    required: true,
  })
  station: radioStationKeys
}
