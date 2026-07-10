import {
  Button,
  type ButtonContext,
  ComponentParam,
  Context,
  SlashCommand,
  type SlashCommandContext,
} from 'necord'

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

  @SlashCommand({
    name: 'play',
    description: 'Select radio station',
  })
  async selectRadio(@Context() [ctx]: SlashCommandContext) {
    return this.botService.selectRadio([ctx])
  }

  @Button('radio-select/:value')
  public onPlayRadio(
    @Context() [ctx]: ButtonContext,
    @ComponentParam('value') value: string,
  ) {
    return this.botService.startPlayingSelectedRadio([ctx], value)
  }

  @SlashCommand({
    name: 'info',
    description: 'Get radio station info',
  })
  async selectRadioStationInfo(@Context() [ctx]: SlashCommandContext) {
    return this.botService.selectRadioStationInfo([ctx])
  }

  @Button('radio-info-select/:value')
  public onRadioInfo(
    @Context() [ctx]: ButtonContext,
    @ComponentParam('value') value: string,
  ) {
    return this.botService.getSelectedRadioInfo([ctx], value)
  }

  @SlashCommand({
    name: 'help',
    description: 'Radio bot command helps',
  })
  async help(@Context() [ctx]: SlashCommandContext) {
    return this.botService.help([ctx])
  }

  @SlashCommand({
    name: 'disconnect',
    description: 'Disconnect bot voice chat',
  })
  async disconnect(@Context() [ctx]: SlashCommandContext) {
    return this.botService.disconnect([ctx])
  }
}
