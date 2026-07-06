import { Context, SlashCommand, type SlashCommandContext } from 'necord'

import { Injectable } from '@nestjs/common'

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
}
