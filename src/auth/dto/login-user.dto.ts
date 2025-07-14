import { Type } from 'class-transformer';
import { IsString, IsDateString, IsOptional } from 'class-validator';
export class LoginUserDto {
  @IsString()
  ci: string;

  @IsDateString()
  birthdate: string;

  @IsString()
  @IsOptional()
  celphone: string;
}
