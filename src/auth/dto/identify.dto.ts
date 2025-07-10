import { IsString, IsDateString } from 'class-validator';

export class IdentifyDto {
  @IsString()
  ci: string;

  @IsDateString()
  birthdate: string; // formato: YYYY-MM-DD
}
