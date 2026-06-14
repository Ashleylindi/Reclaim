import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import envConfig from './config/env.config';
import appConfig from './config/app.config';

import { DatabaseModule } from './database/database.module';

// Feature modules
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JournalModule } from './modules/journal/journal.module';
import { MoodModule } from './modules/mood/mood.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { AiModule } from './modules/ai/ai.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig, appConfig],
    }),

    DatabaseModule,
    UsersModule,
    AuthModule,
    JournalModule,
    MoodModule,
    MeetingsModule,
    AiModule,
    NotificationsModule,
  ],
})
export class AppModule {}

