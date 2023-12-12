import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { YoutubeModule } from './youtube/youtube.module';

@Module({
  imports: [AuthModule, YoutubeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
