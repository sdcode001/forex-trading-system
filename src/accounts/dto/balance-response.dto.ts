import { ApiProperty } from '@nestjs/swagger';

export class BalanceDto {
  @ApiProperty({ description: 'Available balances in all currencies' })
  balances: Map<string, number>;
}