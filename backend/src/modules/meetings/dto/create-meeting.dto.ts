import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  title: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  location?: string;
}
