import { GuildMember } from 'discord.js'
import { type SlashCommandContext } from 'necord'

import { Injectable } from '@nestjs/common'
import { joinVoiceChannel } from '@discordjs/voice'

@Injectable()
export class BotService {
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
}
