import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FXConversionRequestDto } from './dto/fx-conversion-request.dto';
import { FXConversionResponseDto } from './dto/fx-conversion-response.dto';
import { FXRateResponseDto } from './dto/fx-rate-response.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/fx-rates')
  @UseGuards(AuthGuard())  //protected route
  @ApiBearerAuth()
  @ApiOperation({ summary: 'This API fetches live FX conversion rates from memory stored and generates a quoteId to send it in the response'})
  @ApiResponse({ status: 200, description: 'Returns quoteId, expiry_at', type: FXRateResponseDto })
  getFXRates(@Req() req): object {
    return this.appService.getFXRates(req.user);
  }


  @Post('/fx-conversion')
  @UseGuards(AuthGuard())  //protected route
  @ApiBearerAuth()
  @ApiOperation({ summary: 'This API performs an FX conversion using the provided quoteId from fx-rates API and converts the specified amount from one currency to another of user balance'})
  @ApiBody({ description: 'FX conversion request', type: FXConversionRequestDto })
  @ApiResponse({ status: 200, description: 'FX conversion successful', type: FXConversionResponseDto })
  convertFX(@Body() body: { quoteId: string, fromCurrency: string, toCurrency: string, amount: number }, @Req() req): object {
     return this.appService.convertFX(body.quoteId, body.fromCurrency, body.toCurrency, body.amount, req.user);
  }

}
