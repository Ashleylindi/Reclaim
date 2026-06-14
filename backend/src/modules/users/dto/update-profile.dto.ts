import { IsOptional, IsString } from 'class-validator';

export class ContactInfoDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class EmergencyContactDto extends ContactInfoDto {
  @IsOptional()
  @IsString()
  relationship?: string;
}

export class UpdateProfileDto {
  @IsOptional()
  sponsor?: ContactInfoDto;

  @IsOptional()
  therapist?: ContactInfoDto;

  @IsOptional()
  trustedFriend?: ContactInfoDto;

  @IsOptional()
  emergencyContact?: EmergencyContactDto;
}
