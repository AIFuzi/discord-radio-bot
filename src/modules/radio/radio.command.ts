import {
  Context,
  Options,
  SlashCommand,
  type SlashCommandContext,
} from 'necord'
import { lastValueFrom } from 'rxjs'

import { Injectable } from '@nestjs/common'
import { GetMetadataDto } from '@/src/modules/radio/dto/option'

import { RadioService } from './radio.service'

@Injectable()
export class RadioCommand {
  constructor(private readonly radioService: RadioService) {}

  @SlashCommand({
    name: 'test-metadata',
    description: 'Get the radio metadata',
  })
  async getRadioStationMetadata(
    @Context() [ctx]: SlashCommandContext,
    @Options() { station }: GetMetadataDto,
  ) {
    const { data } = await lastValueFrom(
      this.radioService.getRadioStationMetadata(station),
    )

    return ctx.reply(data.artist)
  }
}
