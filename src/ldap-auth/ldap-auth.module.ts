import { Module } from '@nestjs/common';
import { LdapAuthService } from './ldap-auth.service';
import { LdapAuthController } from './ldap-auth.controller';
import { KeycloakModule } from 'src/keycloak/keycloak.module';
@Module({
  imports: [KeycloakModule],
  controllers: [LdapAuthController],
  providers: [LdapAuthService],
})
export class LdapAuthModule {}
