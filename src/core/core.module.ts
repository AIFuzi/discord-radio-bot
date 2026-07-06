import { NecordModule } from 'necord'

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { BotModule } from '@/src/modules/bot/bot.module'
import { CommandsModule } from '@/src/modules/commands/commands.module'
import { RadioModule } from '@/src/modules/radio/radio.module'

import { getDiscordConfig } from './config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NecordModule.forRootAsync({
      useFactory: getDiscordConfig,
      inject: [ConfigService],
    }),
    CommandsModule,
    RadioModule,
    BotModule,
  ],
})
export class CoreModule {}
