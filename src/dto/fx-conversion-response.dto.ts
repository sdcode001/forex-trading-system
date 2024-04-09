import { ApiProperty } from '@nestjs/swagger';

export class FXConversionResponseDto {
  @ApiProperty({ description: 'Converted amount', example: 90.53 })
  convertedAmount: number;

  @ApiProperty({ description: 'Currency of converted amount', example: 'EUR' })
  currency: string;
}