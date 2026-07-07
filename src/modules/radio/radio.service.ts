import { AxiosResponse } from 'axios'
import { Observable } from 'rxjs'

import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GetRadioStationResponse } from '@/src/modules/bot/dto/response'
import { RadioStation, radioStationKeys } from '@/src/shared'

@Injectable()
export class RadioService {
  private readonly url: string

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.url = this.configService.getOrThrow<string>('API_INFO_URL')
  }

  getRadioStationMetadata(
    station: radioStationKeys,
  ): Observable<AxiosResponse<GetRadioStationResponse>> {
    return this.httpService.get(`${this.url}/${RadioStation[station]?.infoId}`)
  }
}
