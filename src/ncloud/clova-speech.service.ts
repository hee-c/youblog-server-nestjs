import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ClovaSpeechService {
  private readonly axiosClient: AxiosInstance;
  constructor(private configService: ConfigService) {
    this.axiosClient = axios.create({
      baseURL: this.configService.get<string>('N_CLOUD_SPEECH_URL'),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-CLOVASPEECH-API-KEY': this.configService.get<string>(
          'N_CLOUD_SPEECH_SECRET_KEY',
        ),
      },
    });
  }

  async requestSpeechRecognition(key: string): Promise<any> {
    return this.axiosClient.post('/recognizer/object-storage', {
      language: 'ko-KR',
      // callback: `${this.configService.get<string>(
      //   'SERVER_URL',
      // )}/speech-callback`,
      completion: 'sync',
      dataKey: key,
      resultToObs: true,
      async: false,
      diarization: {
        enable: false,
      },
    });
  }
}
