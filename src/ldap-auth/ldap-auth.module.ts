import { Module } from '@nestjs/common';
import { LdapAuthService } from './ldap-auth.service';
import { LdapAuthController } from './ldap-auth.controller';

@Module({
  controllers: [LdapAuthController],
  providers: [LdapAuthService],
})
export class LdapAuthModule {}
