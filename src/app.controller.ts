import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { YoutubeService } from './youtube/youtube.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly youtubeService: YoutubeService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/test')
  async test(): Promise<void> {
    await this.youtubeService.getYoutubeVoiceAndPushToS3(
      'https://www.youtube.com/watch?v=YhJq2V8Ud-E',
    );
  }
}
