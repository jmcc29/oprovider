import { Module } from '@nestjs/common';
import { LdapAuthService } from './ldap-auth.service';
import { LdapAuthController } from './ldap-auth.controller';
import { HttpModule } from '@nestjs/axios';
import { KeycloakModule } from 'src/keycloak/keycloak.module';
@Module({
  imports: [HttpModule, KeycloakModule],
  controllers: [LdapAuthController],
  providers: [LdapAuthService],
})
export class LdapAuthModule {}
