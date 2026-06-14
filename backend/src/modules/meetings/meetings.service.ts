import { Injectable } from '@nestjs/common';
import { MeetingsRepository } from './meetings.repository';
import { CreateMeetingDto } from './dto/create-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(private readonly meetingsRepo: MeetingsRepository) {}

  async create(userId: string, dto: CreateMeetingDto) {
    return this.meetingsRepo.create({
      userId: new (require('mongodb').ObjectId)(userId),
      title: dto.title,
      date: dto.date,
      location: dto.location || null,
    });
  }

  async getUserMeetings(userId: string) {
    return this.meetingsRepo.findByUser(userId);
  }

  async markAttended(meetingId: string) {
    return this.meetingsRepo.markAttended(meetingId);
  }

  async updateMeeting(meetingId: string, update: any) {
    return this.meetingsRepo.update(meetingId, update);
  }

  async deleteMeeting(meetingId: string) {
    return this.meetingsRepo.delete(meetingId);
  }
}
