import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';

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

  @MessagePattern('auth.identify')
  async handleIdentify(@Payload() dto: any) {
    const birthdate = new Date(dto.birthdate);
    const user = await this.authService.verifyCiAndBirthdate(dto.ci, birthdate);

    if (!user) return { error: 'Usuario no encontrado' };

    return {
      message: 'Identificación correcta. Ahora debe ingresar su celular.',
      user_id: user.id,
    };
  }
}
