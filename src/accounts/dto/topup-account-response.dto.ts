
import { ApiProperty } from '@nestjs/swagger';

export class TopUpAccountResponseDto {
    @ApiProperty({ description: 'Message indicating the success of the top-up operation', example: 'Balance topup successful - USD:1100' })
    message: string;
}