import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { envs } from 'src/config/envs';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super({
        secretOrKey: envs.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { ci } = payload;
    const user = await this.userRepo.findOneBy({ ci });
    if (!user) {
      throw new UnauthorizedException('Not valid token');
    }
    if (!user.is_active) {
      throw new UnauthorizedException('User is inactive, talk with an admin');
    }
    return user;
  }
}
