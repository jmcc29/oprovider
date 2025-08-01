import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { envs } from 'src/config/envs';
@Injectable()
export class KeycloakClientService {
  private jwks: ReturnType<typeof createRemoteJWKSet>;
  private issuer: string;
  //   private audience: string;
  private expectedAzp: string;

  constructor() {
    this.issuer = envs.keycloak.issuer!;
    this.expectedAzp = envs.keycloak.clientId!;
    // this.audience = envs.keycloak.clientId!;
    this.jwks = createRemoteJWKSet(
      new URL(`${this.issuer}/protocol/openid-connect/certs`),
    );
  }

  async validateTokenKeycloak(token: string) {
    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
        // audience: this.audience,
      });
      //Validación explicita del azp (Authorized Party) esto viene reemplazando la validacion de audience
      if (payload.azp !== this.expectedAzp) {
        throw new UnauthorizedException('Token emitido por otro cliente');
      }
      return {
        isValid: true,
        user: {
          sub: payload.sub,
          username: payload.preferred_username,
          email: payload.email,
          name: payload.name,
          //   realmRoles: payload.realm_access?.roles ?? [],
          // clientRoles: payload.resource_access?.[envs.keycloak.clientId]?.roles ?? [],
        },
      };
    } catch (err) {
      console.error('[KeycloakClientService] Token inválido:', err.message);
      return { isValid: false };
    }
  }
}
