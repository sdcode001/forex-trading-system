import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TopUpAccountDto } from './dto/topup-account.dto';
import { TopUpAccountResponseDto } from './dto/topup-account-response.dto';
import { BalanceDto } from './dto/balance-response.dto';


@Controller('accounts')
export class AccountsController {

  constructor(private readonly accountService: AccountsService) {}

  @Post('/topup')
  @UseGuards(AuthGuard())  //protected route
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Performs top-up balance in user account with bearer token authentication' })
  @ApiBody({ description: 'Amount to top-up in a given currency', type:  TopUpAccountDto})
  @ApiResponse({ status: 200, description: 'Return updated balance after top-up', type: TopUpAccountResponseDto })
  async topUpAccount(@Body() body: { currency: string; amount: number }, @Req() req): Promise<object> {
    return await this.accountService.topUpAccount(body.currency, body.amount, req.user);
  }

  @Get('/balance')
  @UseGuards(AuthGuard())  //protected route
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetches user balance in all currencies with bearer token authentication' })
  @ApiResponse({ status: 200, description: 'Return balances in all currencies', type: BalanceDto })
  async getAccountBalance(@Req() req): Promise<object> {
    return await this.accountService.getAccountBalance(req.user);
  }

}
