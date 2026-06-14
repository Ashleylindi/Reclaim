import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { AiService } from './ai.service';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('dashboard')
  getDashboard(@Req() req: any) {
    return this.aiService.getDashboard(req.user.userId);
  }
}
