import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { UserId } from '../../common/decorators/user-id.decorator';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';

@UseGuards(JwtAuthGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  create(
    @UserId() userId: string,
    @Body() dto: CreateMeetingDto,
  ) {
    return this.meetingsService.create(userId, dto);
  }

  @Get()
  getMyMeetings(@UserId() userId: string) {
    return this.meetingsService.getUserMeetings(userId);
  }

  @Patch(':id/attended')
  markAttended(@Param('id') id: string) {
    return this.meetingsService.markAttended(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.meetingsService.deleteMeeting(id);
  }
}
