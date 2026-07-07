import { GuildMember } from 'discord.js'
import { type SlashCommandContext } from 'necord'

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  isRadioStationKey,
  RadioStation,
  type radioStationKeys,
} from '@/src/shared'
import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice'

@Injectable()
export class BotService {
  constructor(private readonly configService: ConfigService) {}

  async joinToVoiceChannel([ctx]: SlashCommandContext) {
    const member = ctx.member as GuildMember
    if (!member) {
      return ctx.reply('Member is null')
    }

    const channel = member.voice.channel
    if (!channel) {
      return ctx.reply({
        content: 'You are not in the voice channel ',
        ephemeral: true,
      })
    }

    joinVoiceChannel({
      channelId: channel.id,
      guildId: ctx.guildId!,
      adapterCreator: ctx.guild!.voiceAdapterCreator,
    })

    return ctx.reply('Bot joined to voice chat')
  }

  async playRadioStation(
    [ctx]: SlashCommandContext,
    station: radioStationKeys,
  ) {
    if (!isRadioStationKey(station)) {
      return ctx.reply({ content: 'Invalid station', ephemeral: true })
    }

    const member = ctx.member as GuildMember
    if (!member) {
      return ctx.reply('Member is null')
    }

    const channel = member.voice.channel
    if (!channel) {
      return ctx.reply({
        content: 'You are not in the voice channel ',
        ephemeral: true,
      })
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: ctx.guildId!,
      adapterCreator: ctx.guild!.voiceAdapterCreator,
    })

    const player = createAudioPlayer()
    connection.subscribe(player)

    const resource = createAudioResource(
      `${this.configService.getOrThrow<string>('API_RADIO_URL')}${RadioStation[station]?.radioId}`,
    )

    player.play(resource)

    return ctx.reply(`Selected ${station}`)
  }
}
