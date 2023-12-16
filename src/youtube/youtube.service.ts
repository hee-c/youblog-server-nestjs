import { Injectable } from '@nestjs/common';
import { exec } from 'youtube-dl-exec';
import { S3Service } from '../aws/s3.service';
import { ClovaSpeechService } from '../ncloud/clova-speech.service';
import * as fs from 'fs';
import { ClovaStudioService } from '../ncloud/clova-studio.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from '../entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class YoutubeService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly clovaSpeechService: ClovaSpeechService,
    private readonly clovaStudioService: ClovaStudioService,
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
  ) {}

  async getYoutubeVoiceAndPushToS3(url: string): Promise<any> {
    const regex =
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/;
    const key = url.match(regex)[1];

    const post = await this.postRepo.findOneBy({ key });
    if (post) return post;

    await exec(url, {
      // dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      output: `${key}`,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
      extractAudio: true,
      audioFormat: 'mp3',
    });

    const filePath = `${process.cwd()}/${key}.mp3`;
    const storageKey = `speech-request/${key}.mp3`;

    await this.s3Service.putObject(filePath, storageKey);
    const result =
      await this.clovaSpeechService.requestSpeechRecognition(storageKey);
    const content = await this.clovaStudioService.requestChatCompletion(
      result.data.text,
    );

    const createdPost = await this.postRepo.save({
      content,
      key,
    });

    await fs.unlink(filePath, () => {});

    return createdPost;
  }
}
