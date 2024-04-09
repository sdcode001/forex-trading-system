import { ApiProperty } from '@nestjs/swagger';

export class TopUpAccountDto {
  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Amount to top up', example: 100 })
  amount: number;
}