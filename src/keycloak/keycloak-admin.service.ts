import { Inject, Injectable } from '@nestjs/common';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';

@Injectable()
export class KeycloakService {
  constructor(
    @Inject('KEYCLOAK_ADMIN_CLIENT')
    private readonly kcAdminClient: KeycloakAdminClient
  ) {}

  async getClientRoles(clientId: string) {
    const clients = await this.kcAdminClient.clients.find();
    const client = clients.find(c => c.clientId === clientId);
    if (!client) throw new Error('Client not found');
    return this.kcAdminClient.clients.listRoles({ id: client.id! });
  }

  async getAuthorizationResources(clientId: string) {
    const clients = await this.kcAdminClient.clients.find();
    const client = clients.find(c => c.clientId === clientId);
    if (!client) throw new Error('Client not found');

    return this.kcAdminClient.clients.listResources({
      id: client.id!,
    });
  }

  async getAuthorizationScopes(clientId: string) {
    const clients = await this.kcAdminClient.clients.find();
    const client = clients.find(c => c.clientId === clientId);
    if (!client) throw new Error('Client not found');

    return this.kcAdminClient.clients.listAllScopes({
      id: client.id!,
    });
  }

//   async evaluateUserPermissions(
//     clientId: string,
//     userId: string,
//     resource: string,
//     scope: string
//   ) {
//     const clients = await this.kcAdminClient.clients.find();
//     const client = clients.find(c => c.clientId === clientId);
//     if (!client) throw new Error('Client not found');

//     return this.kcAdminClient.clients.evaluatePermission({
//       id: client.id!,
//       userId,
//       permissions: [
//         {
//           resource,
//           scopes: [scope],
//         },
//       ],
//     });
//   }
}
