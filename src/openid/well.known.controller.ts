import { Controller, Get } from '@nestjs/common';

@Controller('.well-known')
export class WellKnownController {
  @Get('openid-configuration')
  getConfig() {
    const issuer = 'http://localhost:3000'; // Ajustar si se usa un dominio

    return {
      issuer,
      authorization_endpoint: `${issuer}/authorize`,
      token_endpoint: `${issuer}/token`,
      userinfo_endpoint: `${issuer}/userinfo`,
      jwks_uri: `${issuer}/.well-known/jwks.json`,
      response_types_supported: ['code'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      scopes_supported: ['openid'],
      token_endpoint_auth_methods_supported: ['client_secret_post'],
      claims_supported: ['sub', 'name', 'birthdate', 'ci'],
    };
  }
}
