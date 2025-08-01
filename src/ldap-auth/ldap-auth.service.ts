import { Injectable } from '@nestjs/common';
import {
  EvaluatePermissionDto,
  LoginLdapAuthDto,
  ValidateTokenDto,
} from './dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { envs } from '../config';
import { KeycloakClientService } from 'src/keycloak/keycloak-client.service';

@Injectable()
export class LdapAuthService {
  constructor(
    private readonly http: HttpService,
    private readonly keycloakClient: KeycloakClientService,
  ) {}
  async getKeycloakToken(username: string, password: string) {
    const body = new URLSearchParams({
      client_id: envs.keycloak.clientId,
      grant_type: 'password',
      username,
      password,
      scope: 'openid',
      client_secret: envs.keycloak.clientSecret, //es confidencial
    });

    const response = await firstValueFrom(
      this.http.post(
        `${envs.keycloak.issuer}/protocol/openid-connect/token`,
        body.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      ),
    );
    return response.data;
  }
  loginLdap(loginLdapDto: LoginLdapAuthDto) {
    const { username, password } = loginLdapDto;
    return this.getKeycloakToken(username, password);
  }
  async validateToken(accessToken: ValidateTokenDto) {
    return this.keycloakClient.validateTokenKeycloak(accessToken.accessToken);
  }
  async evaluatePermissionKeycloak({
    accessToken,
    resource,
    scope,
  }: EvaluatePermissionDto): Promise<boolean> {
    const body = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
      audience: envs.keycloak.clientId,
      response_mode: 'decision',
      permission: `${resource}#${scope}`,
    });
    try {
      const res = await firstValueFrom(
        this.http.post(
          `${envs.keycloak.issuer}/protocol/openid-connect/token`,
          // form,
          body.toString(),
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      // Asegura que haya algo que retornar
      return res.data?.result === true;
    } catch (error) {
      console.error(error?.response?.data || error.message);
      return false;
    }
  }
}
