import { ApiProperty } from '@nestjs/swagger';


export class SignUpLogInResponseDto {
  @ApiProperty({ description: 'Authentication JWT Bearer token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  token: string;
}