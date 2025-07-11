import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { AuthorizationCodeStore } from './authorize.controller'; //TODO cambiar
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class TokenController {
  // ... tus otros endpoints

  @Post('token')
  async token(@Req() req: Request) {
    const {
      grant_type,
      code,
      redirect_uri,
      client_id,
      client_secret, //TODO cambiar
    } = req.body;

    if (grant_type !== 'authorization_code') {
      throw new BadRequestException('Invalid grant_type');
    }

    // TODO Simulación: validar client_id y client_secret
    const expectedClientId = 'my-client';
    const expectedClientSecret = 'dummy-secret';

    if (
      client_id !== expectedClientId ||
      client_secret !== expectedClientSecret
    ) {
      throw new BadRequestException('Invalid client credentials');
    }

    const authData = AuthorizationCodeStore.get(code);
    if (!authData) {
      throw new BadRequestException('Invalid or expired code');
    }

    // Eliminar el code para que no se reutilice
    AuthorizationCodeStore.delete(code);

    // Simular un sub y claims mínimas
    const payload = {
      sub: authData.ci, // o un UUID real si lo tienes
      name: 'Juan Pérez', // opcional
      birthdate: authData.birthdate,
      ci: authData.ci,
      iss: 'http://localhost:3000',
      aud: client_id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 300, // 5 minutos
    };

    // 🔐 Firmar con clave privada (RSA)
    const privateKey = fs.readFileSync(
      path.join(__dirname, '../../keys/private.pem'),
      'utf8',
    );
    const id_token = jwt.sign(
      payload,
      privateKey,
      { algorithm: 'RS256', keyid: 'default-key' }, //TODO firma con kid en jwks.json
    );

    // TODO (opcional) también puedes generar access_token aquí

    return {
      access_token: 'dummy-token', // luego implementamos real
      id_token,
      token_type: 'Bearer',
      expires_in: 300,
    };
  }
}
