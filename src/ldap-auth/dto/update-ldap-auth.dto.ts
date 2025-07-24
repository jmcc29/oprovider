import { PartialType } from '@nestjs/mapped-types';
import { CreateLdapAuthDto } from './create-ldap-auth.dto';

export class UpdateLdapAuthDto extends PartialType(CreateLdapAuthDto) {
  id: number;
}
