import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, IdentifyDto } from './dto';

@Controller()
export class AuthNatsController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.login')
  async handleLogin(@Payload() loginDto: LoginUserDto) {
    const result = await this.authService.login(loginDto);
    console.log('dto', loginDto);
    console.log('Login result:', result);
    return result; // { access_token: '...' }
  }

  @MessagePattern('auth.register')
  async create(@Payload() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @MessagePattern('auth.identify')
  async handleIdentify(@Payload() dto: LoginUserDto) {
    const user = await this.authService.login(dto);

    if (!user) return { error: 'Usuario no encontrado' };

    return {
      message: 'Identificación correcta. Ahora debe ingresar su celular.',
      user_id: user.id,
    };
  }
}
