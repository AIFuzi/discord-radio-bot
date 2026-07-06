import {
  Context,
  Options,
  SlashCommand,
  type SlashCommandContext,
} from 'necord'

import { Injectable, Logger } from '@nestjs/common'

import { TestCommandDto } from './dto'

@Injectable()
export class CommandsCommand {
  private readonly logger = new Logger(CommandsCommand.name)

  constructor() {}

  @SlashCommand({
    name: 'test',
    description: 'Test command!',
  })
  public async onTest(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({ content: `Hello!` })
  }

  @SlashCommand({
    name: 'testparam',
    description: 'Test command!',
  })
  public async onTestWithParam(
    @Context() [interaction]: SlashCommandContext,
    @Options() { param }: TestCommandDto,
  ) {
    return interaction.reply({ content: `Hello! ${param}` })
  }
}
