import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { UserId } from '../../common/decorators/user-id.decorator';
import { MoodService } from './mood.service';

@UseGuards(JwtAuthGuard)
@Controller('mood')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  @Post()
  addMood(@UserId() userId: string, @Body('mood') mood: string) {
    return this.moodService.addMood({ userId, mood });
  }

  @Get()
  getMyMoods(@UserId() userId: string) {
    return this.moodService.getUserMoods(userId);
  }
}
