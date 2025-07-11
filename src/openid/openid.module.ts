import { Module } from '@nestjs/common';
import { WellKnownController } from './well.known.controller';
import { AuthorizationController } from './authorize.controller';
import { TokenController } from './token.controller';

@Module({
  controllers: [WellKnownController, AuthorizationController, TokenController],
})
export class OpenidModule {}
