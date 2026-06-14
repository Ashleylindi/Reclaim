import { Body, Controller, Get, Param, Post, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { UserId } from '../../common/decorators/user-id.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@UserId() userId: string) {
    return this.usersService.getMe(userId);
  }

  @Get(':email')
  getByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Get('id/:id')
  getById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Post(':id/mood')
  addMood(@Param('id') id: string, @Body('mood') mood: string) {
    return this.usersService.addMood(id, mood);
  }

  @Post(':id/journal')
  addJournal(
    @Param('id') id: string,
    @Body() body: { text: string; mood?: string },
  ) {
    return this.usersService.addJournal(id, body.text, body.mood);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/support')
  updateSupport(@UserId() userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, {
      sponsor: dto.sponsor,
      therapist: dto.therapist,
      trustedFriend: dto.trustedFriend,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/emergency-contact')
  updateEmergencyContact(@UserId() userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, {
      emergencyContact: dto.emergencyContact,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/sober-date')
  updateSoberDate(@UserId() userId: string, @Body('startDate') startDate: string) {
    return this.usersService.updateProfile(userId, {
      soberStats: { startDate, daysSober: 0 },
    });
  }
}
