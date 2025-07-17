import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { OpenidModule } from './openid/openid.module';
import { envs } from './config/envs';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.db.host,
      port: envs.db.port,
      username: envs.db.username,
      password: envs.db.password,
      database: envs.db.name,
      autoLoadEntities: true,
      synchronize: true
    }),
    AuthModule,
    OpenidModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
