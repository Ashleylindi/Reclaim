import { Injectable } from '@nestjs/common';
import { MoodRepository } from './mood.repository';
import { CreateMoodDto } from './dto/create-mood.dto';

@Injectable()
export class MoodService {
  constructor(private readonly moodRepo: MoodRepository) {}

  async addMood(dto: CreateMoodDto) {
    return this.moodRepo.create({
      userId: new (require('mongodb').ObjectId)(dto.userId),
      mood: dto.mood,
      date: new Date().toISOString(),
    });
  }

  async getUserMoods(userId: string) {
    return this.moodRepo.findByUser(userId);
  }

  async getLatestMood(userId: string) {
    return this.moodRepo.getLatest(userId);
  }

  async deleteMood(id: string) {
    return this.moodRepo.delete(id);
  }
}
