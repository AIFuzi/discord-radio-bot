import { Module } from '@nestjs/common'

import { BotCommand } from './bot.command'
import { BotService } from './bot.service'

@Module({
  providers: [BotService, BotCommand],
})
export class BotModule {}
