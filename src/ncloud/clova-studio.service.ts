import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { splitStringByLength } from '../common/util';

@Injectable()
export class ClovaStudioService {
  private readonly axiosClient: AxiosInstance;
  constructor(private configService: ConfigService) {
    this.axiosClient = axios.create({
      baseURL: this.configService.get<string>('N_CLOUD_CLOVA_STUDIO_URL'),
      timeout: 60000,
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

  private async requestClovaStudioChatCompletion(
    text: string,
    maxTokens = 1100,
  ): Promise<string> {
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
            content: text,
          },
        ],
        topP: 0.8,
        topK: 0,
        maxTokens,
        temperature: 0.5,
        repeatPenalty: 5.0,
        stopBefore: [],
        includeAiFilters: false,
      },
    );

    return result.data.result.message.content;
  }

  async requestChatCompletion(
    text: string,
  ): Promise<{ blog: string; insta: string; brunch: string }> {
    const partialTexts = splitStringByLength(text, 2800);
    const chunkSize =
      Math.floor(2800 / partialTexts.length) > 1000
        ? 1000
        : Math.floor(2800 / partialTexts.length);

    const summarizedText: string[] = [];
    for (const partialText of partialTexts) {
      const result = await this.requestClovaStudioChatCompletion(
        `아래 텍스트를 ${chunkSize} 글자 내로 요약해줘. "${partialText}"`,
      );
      summarizedText.push(result);
    }

    const result1 = await this.requestClovaStudioChatCompletion(
      `아래 텍스트를 1000자 내로 요약하고, 문맥이 잘 이해될 수 있게 오타, 띄어쓰기, 줄 바꿈을 고쳐줘. "${summarizedText.join(
        ' ',
      )}"`,
    );
    const result2 = await this.requestClovaStudioChatCompletion(
      `아래 텍스트를 [정보성 글을 전문적으로 작성하는 블로거]의 입장에서 블로그에 바로 포스팅 할 수 있는 글로 바꾸어줘. "${result1}"`,
    );
    const result3 = await this.requestClovaStudioChatCompletion(
      `아래 텍스트를 주요 내용에 따라 소주제를 구분하고, 소주제당 하나의 단락씩 구분해줘. "${result2}"`,
    );
    const defaultBlog = await this.requestClovaStudioChatCompletion(
      `아래 텍스트를 단락마다 적합한 소제목을 만들어서 각 단락의 가장 앞에 적어줘. "${result3}"`,
    );
    const instaBlog = await this.requestClovaStudioChatCompletion(
      `아래 텍스트를 좀 더 [유머러스한] 표현으로 바꿔줘. "${defaultBlog}"`,
    );
    const brunchBlog = await this.requestClovaStudioChatCompletion(
      `아래 텍스트를 좀 더 [딱딱하고 자조적인 일기 느낌으로] 바꿔줘. "${defaultBlog}"`,
    );

    return {
      blog: defaultBlog,
      insta: instaBlog,
      brunch: brunchBlog,
    };
  }
}
