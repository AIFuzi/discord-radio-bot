import { IntentsBitField } from 'discord.js'

import { ConfigService } from '@nestjs/config'

export function getDiscordConfig(configService: ConfigService) {
  return {
    token: configService.getOrThrow<string>('DISCORD_TOKEN'),
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildVoiceStates,
    ],
    development:
      configService.getOrThrow<string>('NODE_ENV') === 'development'
        ? [configService.getOrThrow<string>('DISCORD_SERVER_ID')]
        : [],
  }
}
