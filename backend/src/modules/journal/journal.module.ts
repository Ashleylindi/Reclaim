import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { JournalRepository } from './journal.repository';
import { DatabaseModule } from '../../database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, NotificationsModule],
  controllers: [JournalController],
  providers: [JournalService, JournalRepository],
})
export class JournalModule {}
