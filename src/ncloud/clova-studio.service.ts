import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ClovaStudioService {
  private readonly axiosClient: AxiosInstance;
  constructor(private configService: ConfigService) {
    this.axiosClient = axios.create({
      baseURL: this.configService.get<string>('N_CLOUD_CLOVA_STUDIO_URL'),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-NCP-CLOVASTUDIO-API-KEY': this.configService.get<string>(
          'X_NCP_CLOVASTUDIO_API_KEY',
        ),
        'X-NCP-APIGW-API-KEY': this.configService.get<string>(
          'X_NCP_APIGW_API_KEY',
        ),
        'X-NCP-CLOVASTUDIO-REQUEST-ID': this.configService.get<string>(
          'X_NCP_CLOVASTUDIO_REQUEST_ID',
        ),
      },
    });
  }

  async requestChatCompletion(text: string): Promise<string> {
    const smallString = text.substring(0, 2400);

    const result = await this.axiosClient.post(
      '/testapp/v1/chat-completions/HCX-002',
      {
        messages: [
          {
            role: 'system',
            content: '글을 입력받으면 블로그 글로 변환해주는 서비스이다.',
          },
          {
            role: 'user',
            content: `아래 텍스트를 블로그 글로 변환해줘. "${smallString}"`,
          },
        ],
        topP: 0.8,
        topK: 0,
        maxTokens: 1500,
        temperature: 0.5,
        repeatPenalty: 5.0,
        stopBefore: [],
        includeAiFilters: false,
      },
    );

    return result.data.result.message.content;
  }
}
