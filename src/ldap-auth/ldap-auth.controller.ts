import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LdapAuthService } from './ldap-auth.service';
import { LoginLdapAuthDto } from './dto'; 

@Controller()
export class LdapAuthController {
  constructor(private readonly ldapAuthService: LdapAuthService) {}

  @MessagePattern('ldap-auth.login')
  create(@Payload() loginLdapDto: LoginLdapAuthDto) {
    return this.ldapAuthService.loginLdap(loginLdapDto);
  }
}
