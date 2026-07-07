import { EmbedBuilder, GuildMember } from 'discord.js'
import { type SlashCommandContext } from 'necord'
import { lastValueFrom } from 'rxjs'

import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { GetRadioStationResponse } from '@/src/modules/bot/dto'
import {
  isRadioStationKey,
  RadioStation,
  type radioStationKeys,
} from '@/src/shared'
import {
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection,
} from '@discordjs/voice'

@Injectable()
export class BotService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async joinToVoiceChannel([ctx]: SlashCommandContext) {
    this.createConnection([ctx])

    return ctx.reply('Bot joined to voice chat')
  }

  async playRadioStation(
    [ctx]: SlashCommandContext,
    station: radioStationKeys,
  ) {
    if (!isRadioStationKey(station)) {
      return ctx.reply({ content: 'Invalid station', ephemeral: true })
    }

    const { connection, memberInfo } = this.createConnection([ctx])
    if (!connection) {
      return ctx.reply({
        content: 'You are not in the voice channel or invalid member',
        ephemeral: true,
      })
    }

    const player = createAudioPlayer()
    connection.subscribe(player)

    const resource = createAudioResource(
      `${this.configService.getOrThrow<string>('API_RADIO_URL')}${RadioStation[station]?.radioId}`,
    )

    player.play(resource)

    const embed = new EmbedBuilder()
      .setTitle(`Bot connected to channel: ${memberInfo?.voice.channel}`)
      .setDescription(`Playing radio station: ${station.toUpperCase()}`)
      .setImage(RadioStation[station]!.artwork)
      .setColor(RadioStation[station]?.color ?? 16777215)

    return ctx.reply({ embeds: [embed] })
  }

  async getRadioStationInfo(
    [ctx]: SlashCommandContext,
    station: radioStationKeys,
  ) {
    const url = `${this.configService.getOrThrow<string>('API_INFO_URL')}${RadioStation[station]?.infoId}`

    const { data } = await lastValueFrom(
      this.httpService.get<GetRadioStationResponse>(url),
    )

    const embed = new EmbedBuilder()
      .setTitle(`Radio station: ${data.name}`)
      .setDescription(
        `Song: ${data.artist} ・ ${data.song}\n\n${data.lyrics.length > 0 ? `Lyrics: ${data.lyrics.slice(0, 168)}...` : ''}`,
      )
      .setImage(data.artwork)
      .setColor(Math.floor(Math.random() * 1000000))

    return ctx.reply({
      embeds: [embed],
    })
  }

  help([ctx]: SlashCommandContext) {
    return ctx.reply({
      content: `==COMMANDS==\n/play "station-name" - start play selected station\n/info "station-name" - get current track selected station\n/join - join bot to voice chat\n\n== STATIONS ==\n**jpop** - Japan pop station\n**kpop** - Japan pop station\n**anime** - Japan pop station\n**japancity** - Japan pop station\n**rock** - Japan pop station`,
    })
  }

  async disconnect([ctx]: SlashCommandContext) {
    const connection = getVoiceConnection(ctx.guildId!)
    if (!connection) {
      return ctx.reply({
        content: 'Bot is not in the voice channel',
        ephemeral: true,
      })
    }

    connection.destroy()

    return ctx.reply('Bot disconnected')
  }

  private createConnection([ctx]: SlashCommandContext): {
    connection: VoiceConnection | null
    memberInfo?: GuildMember
  } {
    const member = ctx.member as GuildMember
    if (!member) {
      return { connection: null }
    }

    const channel = member.voice.channel
    if (!channel) {
      return { connection: null }
    }

    return {
      connection: joinVoiceChannel({
        channelId: channel.id,
        guildId: ctx.guildId!,
        adapterCreator: ctx.guild!.voiceAdapterCreator,
      }),
      memberInfo: member,
    }
  }
}
