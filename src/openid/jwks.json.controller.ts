import { createPublicKey } from 'crypto';
import { Controller, Get } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { exportJWK } from 'jose';

@Controller('jwks.json')
export class JwksController {

  @Get()
  async getJwks() {
    const pubPem = fs.readFileSync(path.join(__dirname, '../../keys/public.pem'), 'utf8');
    const key = createPublicKey(pubPem);
    const jwk = await exportJWK(key);

    // Añade un 'kid' (key ID) y tipo
    return {
      keys: [
        {
          ...jwk,
          use: 'sig',
          alg: 'RS256',
          kid: 'default-key', //se puede generar uno único
        },
      ],
    };
  }
}
