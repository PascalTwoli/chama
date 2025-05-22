import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginDto } from '../user/dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  registerUser(@Body() registerUserDTo: RegisterUserDto) {
    return this.userService.registerUser(registerUserDTo);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Body() loginDto: LoginDto) {
    return this.userService.loginUser(loginDto);
  }

  @Post('refresh-token')
  refreshAuth(@Query('refreshToken') refreshToken: string) {
    return this.userService.refreshAuthToken(refreshToken);
  }
}

