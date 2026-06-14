import { Module } from '@nestjs/common';
import { MoodController } from './mood.controller';
import { MoodService } from './mood.service';
import { MoodRepository } from './mood.repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MoodController],
  providers: [MoodService, MoodRepository],
})
export class MoodModule {}
