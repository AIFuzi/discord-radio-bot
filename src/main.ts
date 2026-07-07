import ffmpegPath from 'ffmpeg-static'

import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { CoreModule } from './core/core.module'

async function bootstrap() {
  process.env.FFMPEG_PATH = ffmpegPath!

  const app = await NestFactory.create(CoreModule)

  const config = app.get(ConfigService)

  await app.listen(config.getOrThrow<string>('PORT'))
}

void bootstrap()
