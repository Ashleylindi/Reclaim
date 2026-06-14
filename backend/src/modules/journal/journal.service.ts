import { Injectable, Inject } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { JournalRepository } from './journal.repository';
import { CreateJournalDto } from './dto/create-journal.dto';
import { NotificationsService } from '../notifications/notifications.service';
import {
  calculateJournalRisk,
  calculateMoodRisk,
  calculateMeetingRisk,
  combineRisk,
} from '../ai/intelligence/relapse.engine';
import { DATABASE_CONNECTION } from '../../database/mongo.constants';

@Injectable()
export class JournalService {
  constructor(
    private readonly journalRepo: JournalRepository,
    private readonly notificationsService: NotificationsService,
    @Inject(DATABASE_CONNECTION) private readonly db: Db,
  ) {}

  async create(dto: CreateJournalDto) {
    const entry = await this.journalRepo.create({
      userId: new ObjectId(dto.userId),
      text: dto.text,
      date: new Date().toISOString(),
    });

    this.checkAndNotify(dto.userId, dto.text).catch((err) =>
      console.error('checkAndNotify failed:', err),
    );

    return entry;
  }

  private async checkAndNotify(userId: string, newEntryText: string) {
    const objectId = new ObjectId(userId);

    const user = await this.db.collection('users').findOne({ _id: objectId });
    if (!user) return;

    const moodDocs = await this.db
      .collection('moods')
      .find({ userId: objectId })
      .sort({ date: -1 })
      .limit(7)
      .toArray();

    const journals = await this.db
      .collection('journalEntries')
      .find({ userId: objectId })
      .sort({ date: -1 })
      .limit(5)
      .toArray();

    const meetings = await this.db
      .collection('meetings')
      .find({ userId: objectId })
      .toArray();

    const moodRisk = calculateMoodRisk(moodDocs.map((m: any) => m.mood));
    const meetingRisk = calculateMeetingRisk(meetings);
    const journalRisk = calculateJournalRisk(journals);
    const score = combineRisk({ moodRisk, meetingRisk, journalRisk });


    if (score >= 75 && user.emergencyContact?.email) {
      await this.notificationsService.sendAlert({
        userId,
        type: 'emergency',
        score,
        entryText: newEntryText,
        recipientName: user.emergencyContact.name ?? 'Emergency Contact',
        recipientEmail: user.emergencyContact.email,
        userName: user.name,
      });
    } else if (score >= 60 && user.sponsor?.email) {
      await this.notificationsService.sendAlert({
        userId,
        type: 'sponsor',
        score,
        entryText: newEntryText,
        recipientName: user.sponsor.name ?? 'Sponsor',
        recipientEmail: user.sponsor.email,
        userName: user.name,
      });
    }
  }

  async getUserJournal(userId: string) {
    return this.journalRepo.findByUser(userId);
  }

  async deleteEntry(entryId: string) {
    return this.journalRepo.delete(entryId);
  }
}
