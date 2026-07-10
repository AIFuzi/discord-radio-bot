import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
} from 'discord.js'
import { ButtonContext, type SlashCommandContext } from 'necord'
import { lastValueFrom } from 'rxjs'

import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { GetRadioStationResponse } from '@/src/modules/bot/dto'
import { RadioStation, radioTypes } from '@/src/shared'
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection,
} from '@discordjs/voice'

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name)
  private readonly player: AudioPlayer

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.player = createAudioPlayer()
  }

  async joinToVoiceChannel([ctx]: SlashCommandContext) {
    this.createConnection([ctx])

    return ctx.reply('Bot joined to voice chat')
  }

  async selectRadio([ctx]: SlashCommandContext) {
    const connection = getVoiceConnection(ctx.guildId!)
    if (!connection) {
      const newConnection = this.createConnection([ctx])
      if (!newConnection) {
        return ctx.reply({ content: 'You not in voice chat', ephemeral: true })
      }
    }

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      radioTypes.map(rt =>
        new ButtonBuilder()
          .setCustomId(`radio-select/${rt}`)
          .setLabel(rt)
          .setStyle(ButtonStyle.Primary),
      ),
    )

    return ctx.reply({
      content: 'Select radio station:',
      components: [buttons],
    })
  }

  async startPlayingSelectedRadio([ctx]: ButtonContext, value: string) {
    const memberInfo = ctx.member as GuildMember

    const connection = getVoiceConnection(ctx.guildId!)
    if (!connection) {
      return ctx.reply({
        content: 'You are not in the voice channel or invalid member',
        ephemeral: true,
      })
    }

    connection.subscribe(this.player)

    const resource = createAudioResource(
      `${this.configService.getOrThrow<string>('API_RADIO_URL')}${RadioStation[value]?.radioId}`,
    )

    this.player.play(resource)

    this.player.on('stateChange', newState => {
      if (
        newState.status === AudioPlayerStatus.Idle ||
        newState.status === AudioPlayerStatus.Playing
      ) {
        const resource = createAudioResource(
          `${this.configService.getOrThrow<string>('API_RADIO_URL')}${RadioStation[value]?.radioId}`,
        )

        this.player.play(resource)

        this.logger.debug('Audio player restarted')
      }
    })

    this.player.on('error', err => {
      this.logger.error(err)
    })

    const embed = new EmbedBuilder()
      .setTitle(`Bot connected to channel: ${memberInfo?.voice.channel}`)
      .setDescription(`Playing radio station: ${value.toUpperCase()}`)
      .setImage(RadioStation[value]!.artwork)
      .setColor(RadioStation[value]?.color ?? 16777215)

    return ctx.reply({ embeds: [embed] })
  }

  async selectRadioStationInfo([ctx]: SlashCommandContext) {
    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      radioTypes.map(rt =>
        new ButtonBuilder()
          .setCustomId(`radio-info-select/${rt}`)
          .setLabel(rt)
          .setStyle(ButtonStyle.Primary),
      ),
    )

    return ctx.reply({
      content: 'Select radio station: ',
      components: [buttons],
    })
  }

  async getSelectedRadioInfo([ctx]: ButtonContext, value: string) {
    try {
      const url = `${this.configService.getOrThrow<string>('API_INFO_URL')}${RadioStation[value]?.infoId}`

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
    } catch (error) {
      return ctx.reply(`[FATAL ERROR]: ${error.message}`)
    }
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
    this.player.stop()

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
        selfDeaf: false,
      }),
      memberInfo: member,
    }
  }
}
