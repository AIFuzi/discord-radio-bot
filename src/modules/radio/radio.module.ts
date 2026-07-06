import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { RadioCommand } from '@/src/modules/radio/radio.command'

import { RadioService } from './radio.service'

@Module({
  imports: [HttpModule],
  providers: [RadioCommand, RadioService],
})
export class RadioModule {}
