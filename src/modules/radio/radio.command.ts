import { Context, SlashCommand, type SlashCommandContext } from 'necord'
import { lastValueFrom } from 'rxjs'

import { Injectable } from '@nestjs/common'

import { RadioService } from './radio.service'

@Injectable()
export class RadioCommand {
  constructor(private readonly radioService: RadioService) {}

  @SlashCommand({
    name: 'test-metadata',
    description: 'Get the radio metadata',
  })
  async getRadioStationMetadata(@Context() [ctx]: SlashCommandContext) {
    const { data } = await lastValueFrom(
      this.radioService.getRadioStationMetadata(),
    )
    console.log(data)

    return ctx.reply(data.artist)
  }
}
