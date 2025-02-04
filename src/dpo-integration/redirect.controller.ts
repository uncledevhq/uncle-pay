import { Controller, Get, Param, Query } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('DPO Redirect')
@Controller('redirect')
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get('success/:transactionToken')
  @ApiOperation({ summary: 'Handle successful payment redirect' })
  @ApiResponse({
    status: 200,
    description: 'Payment status verified successfully',
  })
  handleSuccess(@Param('transactionToken') transactionToken: string) {
    return this.redirectService.handleSuccess(transactionToken);
  }

  @Get('pending/:transactionToken')
  @ApiOperation({ summary: 'Handle pending payment redirect' })
  @ApiResponse({
    status: 200,
    description: 'Payment status checked successfully',
  })
  handlePending(@Param('transactionToken') transactionToken: string) {
    return this.redirectService.handlePending(transactionToken);
  }

  @Get('failed/:transactionToken')
  @ApiOperation({ summary: 'Handle failed payment redirect' })
  @ApiResponse({
    status: 200,
    description: 'Payment status updated successfully',
  })
  handleFailed(@Param('transactionToken') transactionToken: string) {
    return this.redirectService.handleFailed(transactionToken);
  }

  @Get('check')
  @ApiOperation({ summary: 'Check payment status from DPO redirect' })
  @ApiResponse({
    status: 200,
    description: 'Payment status retrieved successfully',
    schema: {
      example: {
        status: 'success',
        transaction: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          status: 'completed',
          transactionToken: 'D7B8F9E2-1A3C-4D5E-9F8A-7B6C5D4E3F2A',
        },
        redirectParams: {
          TransID: 'T123456789',
          CCDapproval: 'AP123456',
          PnrID: 'PNR123',
          TransactionToken: 'D7B8F9E2-1A3C-4D5E-9F8A-7B6C5D4E3F2A',
          CompanyRef: 'REF001',
        },
      },
    },
  })
  checkStatus(
    @Query('TransID') transId: string,
    @Query('CCDapproval') ccdApproval: string,
    @Query('PnrID') pnrId: string,
    @Query('TransactionToken') transactionToken: string,
    @Query('CompanyRef') companyRef: string,
  ) {
    return this.redirectService.handleCheck({
      transId,
      ccdApproval,
      pnrId,
      transactionToken,
      companyRef,
    });
  }
}
