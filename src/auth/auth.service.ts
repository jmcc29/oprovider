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
    return {
      ...user,
      token: this.getJWTToken({ id: user.id }),
    };
  }

  async verifyCiAndBirthdate(ci: string, birthdate: Date) {
    const formattedDate = birthdate.toISOString().split('T')[0]; // "YYYY-MM-DD"

    return this.userRepo
      .createQueryBuilder('user')
      .where('user.ci = :ci', { ci })
      .andWhere("TO_CHAR(user.birthdate, 'YYYY-MM-DD') = :birthdate", {
        birthdate: formattedDate,
      })
      .getOne();
  }
}
