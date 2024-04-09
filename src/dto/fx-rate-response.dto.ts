import { ApiProperty } from '@nestjs/swagger';

export class FXRateResponseDto {
  @ApiProperty({ description: 'Generated quote ID', example: '12345' })
  quoteId: string;

  @ApiProperty({ description: 'Expiry timestamp of the quote', example: '19:09:00 GMT+0530' })
  expiry_at: string;
}