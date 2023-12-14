import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { splitStringByLength } from '../common/util';

@Injectable()
export class ClovaSummaryService {
  private readonly axiosClient: AxiosInstance;
  constructor(private configService: ConfigService) {
    this.axiosClient = axios.create({
      timeout: 3000,
      headers: {
        'Content-Type': 'application/json',
        'X-NCP-APIGW-API-KEY-ID': this.configService.get<string>(
          'X_NCP_APIGW_API_KEY_ID',
        ),
        'X-NCP-APIGW-API-KEY': this.configService.get<string>(
          'X_NCP_APIGW_API_KEY',
        ),
      },
    });
  }

  async requestSummary(text: string): Promise<void> {
    try {
      const texts = splitStringByLength(text, 2000);

      const promises = texts.map((text) => {
        return this.axiosClient.post(
          'https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize',
          {
            document: {
              content: text,
            },
            option: {
              language: 'ko',
              summaryCount: 100,
            },
          },
        );
      });
      const result = await Promise.all(promises);
      console.log('done');
    } catch (e) {
      console.log(e);
    }
    console.log('summary');
  }
}
