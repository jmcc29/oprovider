import { Module, Global } from '@nestjs/common';
import { createKeycloakAdminClient } from './keycloak-admin.provider';

@Global()
@Module({
  providers: [
    {
      provide: 'KEYCLOAK_ADMIN_CLIENT',
      useFactory: async () => {
        return await createKeycloakAdminClient();
      },
    },
  ],
  exports: ['KEYCLOAK_ADMIN_CLIENT'],
})
export class KeycloakAdminModule {}
