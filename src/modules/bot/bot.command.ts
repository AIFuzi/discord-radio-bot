import {
  Context,
  Options,
  SlashCommand,
  type SlashCommandContext,
} from 'necord'

import { Injectable } from '@nestjs/common'
import { RadioStationDto } from '@/src/modules/bot/dto'

import { BotService } from './bot.service'

@Injectable()
export class BotCommand {
  constructor(private readonly botService: BotService) {}

  @SlashCommand({
    name: 'join',
    description: 'Join bot to voice chat',
  })
  async joinToVoiceChannel(@Context() [ctx]: SlashCommandContext) {
    return this.botService.joinToVoiceChannel([ctx])
  }

  @SlashCommand({
    name: 'play',
    description: 'Play selected radio station',
  })
  async playRadioStation(
    @Context() [ctx]: SlashCommandContext,
    @Options() { station }: RadioStationDto,
  ) {
    return this.botService.playRadioStation([ctx], station)
  }
}
