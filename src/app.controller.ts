import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Post('/post')
  async createPost(@Body() body: { youtubeUrl: string }): Promise<any> {
    const post = await this.youtubeService.getYoutubeVoiceAndPushToS3(
      body.youtubeUrl,
    );

    return {
      title: post.title,
      content: {
        blog: post.blog,
        insta: post.insta,
        brunch: post.brunch,
      },
      key: post.key,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  // @Post('/speech-callback')
  // async genChat(@Body() body: any): Promise<void> {
  //   const content = await this.clovaStudioService.requestChatCompletion(
  //     body.text,
  //   );
  // }
  //
  // @Get('/post/:key')
  // async getPostByKey(@Param('key') key: string): Promise<string> {
  //   const post = await this.postRepo.findOneBy({ key });
  //
  //   return post.content;
  // }
}
