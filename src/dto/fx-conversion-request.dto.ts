import { ApiProperty } from '@nestjs/swagger';

export class FXConversionRequestDto {
  @ApiProperty({ description: 'Quote ID generated from fx-rates API', example: 'example123' })
  quoteId: string;

  @ApiProperty({ description: 'Currency to convert from', example: 'USD' })
  fromCurrency: string;

  @ApiProperty({ description: 'Currency to convert to', example: 'EUR' })
  toCurrency: string;

  @ApiProperty({ description: 'Amount to convert', example: 100 })
  amount: number;
}