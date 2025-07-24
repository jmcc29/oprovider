import { IsString} from 'class-validator';
export class LoginLdapUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
