import { Injectable, HttpServer } from '@nestjs/common';
import { LoginLdapUserDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/config/envs';

@Injectable()
export class LdapAuthService {
  constructor(
    private readonly http: HttpServer,
  ) {}

  async getKeycloakToken(loginDto: LoginLdapUserDto) {
    const body = new URLSearchParams({
      client_id: 'your-client-id',
      grant_type: 'password',
      username: loginDto.username,
      password: loginDto.password,
      scope: 'openid',
      client_secret: 'your-client-secret',
    });

    const response = await firstValueFrom(
      this.http.post(
        `http://${envs.keycloak.url}/realms/${envs.keycloak.realm}/protocol/openid-connect/token`,
        body.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      ),
    );
    return response.data;
  }
}
