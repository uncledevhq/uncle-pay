import { Controller, Get, Param } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('DPO Redirect')
@Controller('redirect')
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get('success/:transactionToken')
  @ApiOperation({ summary: 'Handle successful payment redirect' })
  @ApiResponse({
    status: 200,
    description: 'Payment processed successfully',
  })
  @ApiResponse({ status: 400, description: 'Payment verification failed' })
  handleSuccess(@Param('transactionToken') transactionToken: string) {
    return this.redirectService.handleSuccess(transactionToken);
  }

  @Get('pending/:transactionToken')
  @ApiOperation({ summary: 'Handle pending payment redirect' })
  @ApiResponse({
    status: 200,
    description: 'Payment status checked successfully',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  handlePending(@Param('transactionToken') transactionToken: string) {
    return this.redirectService.handlePending(transactionToken);
  }

  @Get('failed/:transactionToken')
  @ApiOperation({ summary: 'Handle failed payment redirect' })
  @ApiResponse({
    status: 200,
    description: 'Payment failure processed',
  })
  handleFailed(@Param('transactionToken') transactionToken: string) {
    return this.redirectService.handleFailed(transactionToken);
  }
}
