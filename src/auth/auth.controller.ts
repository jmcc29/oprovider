import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IdentifyDto } from './dto/identify.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('identify')
  async identify(@Body() dto: IdentifyDto) {
    const birthdate = new Date(dto.birthdate);

    const user = await this.authService.verifyCiAndBirthdate(dto.ci, birthdate);

    if (!user) {
      throw new NotFoundException('No se encontró un usuario con los datos proporcionados');
    }

    return {
      message: 'Identificación correcta. Ahora debe ingresar su celular.',
      user_id: user.id,
    };
  }
}
