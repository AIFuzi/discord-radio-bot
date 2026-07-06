import { Module } from '@nestjs/common'

import { CommandsCommand } from './commands.command'

@Module({
  providers: [CommandsCommand],
})
export class CommandsModule {}
