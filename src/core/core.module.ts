import { NecordModule } from 'necord'

import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { BotModule } from '@/src/modules/bot/bot.module'

import { getDiscordConfig } from './config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NecordModule.forRootAsync({
      useFactory: getDiscordConfig,
      inject: [ConfigService],
    }),
    HttpModule.register({ global: true }),
    BotModule,
  ],
})
export class CoreModule {}
