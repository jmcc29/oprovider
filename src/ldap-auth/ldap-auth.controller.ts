import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LdapAuthService } from './ldap-auth.service';
import { LoginLdapUserDto } from './dto/login-ldap-user.dto';

@Controller()
export class AuthNatsController {
  constructor(private readonly authService: LdapAuthService) {}

  @MessagePattern('ldap-auth.login')
  async handleLogin(@Payload() loginDto: LoginLdapUserDto) {
    const result = await this.authService.getKeycloakToken(loginDto);
    console.log('dto', loginDto);
    console.log('Login result:', result);
    return result; // { access_token: '...' }
  }
}
