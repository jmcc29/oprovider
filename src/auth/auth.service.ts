import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, please check server logs',
    );
  }

  private getJWTToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepo.create(createUserDto);
      await this.userRepo.save(user);
      return {
        ...user,
        token: this.getJWTToken({ id: user.id }),
      };
    } catch (error) {
      console.log(this.handleDBErrors(error));
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { ci, birthdate } = loginUserDto;
    const user = await this.userRepo.findOne({
      where: {
        ci,
        birthdate: birthdate,
      },
      select: {
        id: true,
        ci: true,
        birthdate: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const token = this.getJWTToken({ id: user.id });
    return {
      ...user,
      token,
    };
  }
  
  // async exchangeTokenWithKeycloak(subjectToken: string, username: string) {
  //   const formData = new URLSearchParams();
  //   formData.append(
  //     'grant_type',
  //     'urn:ietf:params:oauth:grant-type:token-exchange',
  //   );
  //   formData.append('subject_token', subjectToken); // o un dummy token
  //   formData.append('client_id', 'gateway-service');
  //   formData.append('client_secret', 'hwVjS9nDD4wfpnqVeXcU6gcky1iLY2hK');
  //   formData.append('requested_subject', username); // o ID

  //   const response = await firstValueFrom(
  //     this.httpService.post(
  //       'http://192.168.1.100:8080/realms/myrealm/protocol/openid-connect/token',
  //       formData,
  //       {
  //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //       },
  //     ),
  //   );

  //   return response.data;
  // }
}
