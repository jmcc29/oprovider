import { IsString, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateUserDto {
  @IsString()
  ci: string;

  @IsString()
  first_name: string;

  @IsString()
  second_name: string;

  @IsString()
  lastname: string;

  @IsString()
  @IsOptional()
  mother_lastname: string;

  @IsDateString()
  @Type(() => Date)
  birthdate: Date;

  @IsString()
  @IsOptional()
  celphone: string;
}
