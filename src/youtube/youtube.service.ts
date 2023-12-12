import { Injectable } from '@nestjs/common';
import { exec } from 'youtube-dl-exec';

@Injectable()
export class YoutubeService {
  async getYoutubeVoiceAndPushToS3(url: string) {
    exec(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
      extractAudio: true,
    }).then((output) => console.log(output));
    console.log(test);
  }
}
