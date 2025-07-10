import { Module } from '@nestjs/common';
import { WellKnownController } from './well.known.controller';
import { AuthorizationController } from './authorize.controller';

@Module({
  controllers: [WellKnownController, AuthorizationController],
})
export class OpenidModule {}
