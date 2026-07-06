import { NecordModule } from 'necord'

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { getDiscordConfig } from './config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NecordModule.forRootAsync({
      useFactory: getDiscordConfig,
      inject: [ConfigService],
    }),
  ],
})
export class CoreModule {}
