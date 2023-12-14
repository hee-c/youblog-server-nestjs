import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { AwsModule } from '../aws/aws.module';
import { NcloudModule } from '../ncloud/ncloud.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../entities/post.entity';

@Module({
  imports: [AwsModule, NcloudModule, TypeOrmModule.forFeature([PostEntity])],
  providers: [YoutubeService],
  exports: [YoutubeService],
})
export class YoutubeModule {}
