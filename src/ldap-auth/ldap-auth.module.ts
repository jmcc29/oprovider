import { Module } from '@nestjs/common';
import { LdapAuthService } from './ldap-auth.service';
import { LdapAuthController } from './ldap-auth.controller';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [LdapAuthController],
  providers: [LdapAuthService],
})
export class LdapAuthModule {}
