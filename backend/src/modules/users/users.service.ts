import { Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async createUser(dto: CreateUserDto) {
    const existing = await this.usersRepo.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('User already exists');
    }

    const now = new Date().toISOString();

    return this.usersRepo.create({
      ...dto,
      soberStats: {
        daysSober: 0,
        startDate: now,
      },
      moodLog: [],
      meetings: [],
      journalEntries: [],
      createdAt: now,
      updatedAt: now,
    } as any);
  }

  async getUserByEmail(email: string) {
    return this.usersRepo.findByEmail(email);
  }

  async getUserById(id: string) {
    return this.usersRepo.findById(id);
  }

  async addMood(userId: string, mood: string) {
    return this.usersRepo.pushToArray(userId, 'moodLog', {
      date: new Date().toISOString(),
      mood,
    });
  }

  async addJournal(userId: string, text: string, mood?: string) {
    return this.usersRepo.pushToArray(userId, 'journalEntries', {
      date: new Date().toISOString(),
      text,
      mood,
    });
  }

  async updateProfile(userId: string, update: Partial<any>) {
    return this.usersRepo.update(userId, {
      ...update,
      updatedAt: new Date().toISOString(),
    });
  }

  async getMe(userId: string) {
    return this.usersRepo.findById(userId);
  }
}
