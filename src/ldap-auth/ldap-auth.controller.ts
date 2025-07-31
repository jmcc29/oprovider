import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LdapAuthService } from './ldap-auth.service';
import { EvaluatePermissionDto, LoginLdapAuthDto, ValidateTokenDto } from './dto'; 

@Controller()
export class LdapAuthController {
  constructor(private readonly ldapAuthService: LdapAuthService) {}

  @MessagePattern('ldap-auth.login')
  create(@Payload() loginLdapDto: LoginLdapAuthDto) {
    return this.ldapAuthService.loginLdap(loginLdapDto);
  }

  @MessagePattern('ldap-auth.validateToken')
  validateToken(@Payload() dto: ValidateTokenDto ) {
    return this.ldapAuthService.validateTokenKeycloak(dto);
  }
  
  @MessagePattern('ldap-auth.evaluatePermission')
  evaluatePermission(@Payload() dto: EvaluatePermissionDto) {
    return this.ldapAuthService.evaluatePermissionKeycloak(dto);
  }
}
