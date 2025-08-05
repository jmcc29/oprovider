import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/config/envs';

const keycloakEndpoint={
  token: envs.keycloak.endpoint.token,
  certs: envs.keycloak.endpoint.certs,
}
@Injectable()
export class KeycloakClientService {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;
  private readonly issuer: string;
  private readonly expectedAzp: string;
  private readonly defaultHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  //private audience: string;

  constructor(
    private readonly http: HttpService
  ) {
    if (!envs.keycloak.issuer) {
      throw new Error('Keycloak issuer is not defined');
    }
    this.issuer = envs.keycloak.issuer;
    this.expectedAzp = envs.keycloak.clientId;
    this.jwks = createRemoteJWKSet(
      new URL(keycloakEndpoint.certs),
    );
  }

  async getToken(username: string, password: string) {
    const body = new URLSearchParams({
      client_id: envs.keycloak.clientId,
      grant_type: 'password',
      username,
      password,
      scope: 'openid',
      client_secret: envs.keycloak.clientSecret,
    });

    const res = await firstValueFrom(
      this.http.post(keycloakEndpoint.token, body.toString(), {
        headers: this.defaultHeaders,
      }),
    );

    return res.data;
  }

  async validateToken(token: string) {
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
  
  async evaluatePermission(accessToken: string, resource: string, scope: string): Promise<boolean> {
    const body = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
      audience: envs.keycloak.clientId,
      response_mode: 'decision',
      permission: `${resource}#${scope}`,
    });

    try {
      const res = await firstValueFrom(
        this.http.post(keycloakEndpoint.token, body.toString(), {
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return res.data?.result === true;
    } catch (error) {
      console.error('[KeycloakClientService] evaluatePermission error:', error?.response?.data || error.message);
      return false;
    }
  }

}
