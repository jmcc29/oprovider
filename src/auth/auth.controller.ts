import { CreateUserDto, IdentifyDto, LoginUserDto } from './dto';
import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser, RawHeaders } from './decorators';
import { Headers } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';

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
  @UseGuards(AuthGuard('jwt'))
  testingPrivateRoute(
    // @Req() req: Request,
    @GetUser() user: User,
    @GetUser('ci') ci: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders, // Optional: if you want to access headers
  ) {
    // console.log(req)
    return {
      ok: true,
      message: 'You are authenticated',
      user,
      ci,
      rawHeaders, 
      headers, // Optional: if you want to access headers
    };
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
