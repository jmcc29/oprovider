import { Module } from '@nestjs/common';
import { WellKnownController } from './well.known.controller';
import { AuthorizationController } from './authorize.controller';
import { TokenController } from './token.controller';
import { JwksController } from './jwks.json.controller';

@Module({
  controllers: [WellKnownController, AuthorizationController, TokenController, JwksController],
})
export class OpenidModule {}
