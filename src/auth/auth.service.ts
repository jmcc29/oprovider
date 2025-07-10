import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

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
