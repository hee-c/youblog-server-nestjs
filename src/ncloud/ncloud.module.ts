import { Module } from '@nestjs/common';
import { ClovaSpeechService } from './clova-speech.service';
import { ClovaSummaryService } from './clova-summary.service';
import { ClovaStudioService } from './clova-studio.service';

@Module({
  providers: [ClovaSpeechService, ClovaSummaryService, ClovaStudioService],
  exports: [ClovaSpeechService, ClovaSummaryService, ClovaStudioService],
})
export class NcloudModule {}
