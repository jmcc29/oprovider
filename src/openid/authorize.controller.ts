import {
  Controller,
  Get,
  Query,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { v4 as Uuid } from 'uuid';

const store = new Map<string, { ci: string; birthdate: string; nonce?: string }>();

export const AuthorizationCodeStore = {
  set(code: string, data: { ci: string; birthdate: string ; nonce?: string }) {
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
  async authorize(@Query() query: any, @Res() res: any) {
    console.log(query);
    if (!query.ci || !query.birthdate) {
      const html = `
      <html>
        <body>
          <h2>Login con CI y Fecha de Nacimiento</h2>
          <form method="GET" action="/authorize">
            <input type="hidden" name="client_id" value="${query.client_id || ''}" />
            <input type="hidden" name="redirect_uri" value="${query.redirect_uri || ''}" />
            <input type="hidden" name="scope" value="${query.scope || ''}" />
            <input type="hidden" name="response_type" value="${query.response_type || ''}" />
            <input type="hidden" name="state" value="${query.state || ''}" />
            <input type="hidden" name="nonce" value="${query.nonce || ''}" />
            <label>CI: <input name="ci" /></label><br/>
            <label>Fecha de nacimiento: <input name="birthdate" /></label><br/>
            <button type="submit">Ingresar</button>
          </form>
        </body>
      </html>
    `;
    console.log(html);
      return res.send(html);
    }

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

    const code = Uuid();
    AuthorizationCodeStore.set(code, { ci, birthdate, nonce: query.nonce });

    const url = new URL(redirect_uri);
    url.searchParams.set('code', code);
    if (state) url.searchParams.set('state', state);

    return res.redirect(url.toString());
  }
}
