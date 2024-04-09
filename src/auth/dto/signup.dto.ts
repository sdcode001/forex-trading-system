import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'User name', example: 'Souvik Dey' })
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'User Password', example: 'password123' })
  readonly password: string;
}