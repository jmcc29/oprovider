import { CreateUserDto, IdentifyDto, LoginUserDto } from './dto';
import { Controller, Post, Body, NotFoundException, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard('jwt') )
  async testingPrivateRoute() {
    return 'This is a private route, you are authenticated!'; 
  }
  
  @Post('identify')
  async identify(@Body() dto: IdentifyDto) {
    const birthdate = new Date(dto.birthdate);

    const user = await this.authService.verifyCiAndBirthdate(dto.ci, birthdate);

    if (!user) {
      throw new NotFoundException(
        'No se encontró un usuario con los datos proporcionados',
      );
    }

    return {
      message: 'Identificación correcta. Ahora debe ingresar su celular.',
      user_id: user.id,
    };
  }
}
