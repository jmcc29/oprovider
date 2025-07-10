import {
  Controller,
  Get,
  Query,
  Redirect,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

const store = new Map<string, { ci: string; birthdate: string }>();

export const AuthorizationCodeStore = {
  set(code: string, data: { ci: string; birthdate: string }) {
    store.set(code, data);
  },
  get(code: string) {
    return store.get(code);
  },
  delete(code: string) {
    return store.delete(code);
  },
};

interface AuthorizeQuery {
  response_type: string;
  client_id: string;
  redirect_uri: string;
  scope: string;
  state?: string;
  ci: string;
  birthdate: string;
}

@Controller()
export class AuthorizationController {
  @Get('authorize')
  @Redirect()
  async authorize(@Query() query: AuthorizeQuery) {
    const {
      response_type,
      client_id,
      redirect_uri,
      scope,
      state,
      ci,
      birthdate,
    } = query;

    if (
      response_type !== 'code' ||
      !client_id ||
      !redirect_uri ||
      scope !== 'openid'
    ) {
      throw new BadRequestException('Invalid OIDC parameters');
    }

    const isValidUser = ci === '12345678' && birthdate === '1990-05-10'; // REEMPLAZAR luego

    if (!isValidUser) {
      throw new BadRequestException('Usuario no válido');
    }

    const code = uuidv4();
    AuthorizationCodeStore.set(code, { ci, birthdate });

    const url = new URL(redirect_uri);
    url.searchParams.set('code', code);
    if (state) url.searchParams.set('state', state);

    return { url: url.toString() };
  }
}
