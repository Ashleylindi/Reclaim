import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateMeetingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  attended?: boolean;
}
