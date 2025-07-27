import { Injectable } from '@nestjs/common';
import { LoginLdapAuthDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { envs } from '../config';

@Injectable()
export class LdapAuthService {
  constructor(
    private readonly http: HttpService
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
        `${envs.keycloak.url}/realms/${envs.keycloak.realm}/protocol/openid-connect/token`,
        body.toString(), 
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      ),
    );
    return response.data;
  }
  loginLdap(loginLdapDto: LoginLdapAuthDto) {
    const { username, password } = loginLdapDto;
    return this.getKeycloakToken(username, password)
  }
}
