import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as fs from 'fs';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      endpoint: this.configService.get<string>(
        'N_CLOUD_OBJECT_STORAGE_END_POINT',
      ),
      region: this.configService.get<string>('N_CLOUD_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
      },
    });
  }

  async putObject(path: string, key: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: 'youblog',
      Key: key,
      Body: fs.readFileSync(path),
    });

    await this.s3Client.send(command);
  }
}
