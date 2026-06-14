import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { UserId } from '../../common/decorators/user-id.decorator';
import { JournalService } from './journal.service';

@UseGuards(JwtAuthGuard)
@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  create(@UserId() userId: string, @Body('text') text: string, @Body('mood') mood?: string) {
    return this.journalService.create({
      userId,
      text,
    });
  }

  @Get()
  getUserJournal(@UserId() userId: string) {
    return this.journalService.getUserJournal(userId);
  }
}
