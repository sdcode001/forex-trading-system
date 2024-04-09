import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { SignUpLogInResponseDto } from './dto/login-signup-response.dto';



@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Perform SignUp for User' })
  @ApiBody({ description: 'User SignUp request body', type: SignUpDto })
  @ApiResponse({ status: 200, description: 'Return JWT Bearer token', type: SignUpLogInResponseDto })
  signUp(@Body() signUpDto: SignUpDto): Promise<object> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Perform LogIn for User' })
  @ApiBody({ description: 'User Login request body', type: LoginDto })
  @ApiResponse({ status: 200, description: 'Return JWT Bearer token', type: SignUpLogInResponseDto })
  login(@Body() loginDto: LoginDto): Promise<object> {
    return this.authService.login(loginDto);
  }
}
