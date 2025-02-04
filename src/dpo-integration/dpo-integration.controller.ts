import { Controller, Post, Body, Param } from '@nestjs/common';
import { DpoIntegrationService } from './dpo-integration.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('DPO Integration')
@Controller('dpo-integration')
export class DpoIntegrationController {
  constructor(private readonly dpoIntegrationService: DpoIntegrationService) {}

  @Post('create-transaction')
  @ApiOperation({ summary: 'Create a new transaction token' })
  @ApiBody({
    description: 'Transaction details',
    examples: {
      example1: {
        value: {
          policyId: '123e4567-e89b-12d3-a456-426614174000',
          policyNumber: 'POL-2024-001',
          currency: 'USD',
          totalAmount: 5000.0,
          vehicleRegistration: 'KAA 123A',
          companyRef: 'REF-001',
          callbackURL: 'https://example.com',
        },
        summary: 'Sample transaction request',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction token created successfully',
    schema: {
      example: {
        transactionToken: 'D7B8F9E2-1A3C-4D5E-9F8A-7B6C5D4E3F2A',
        paymentUrl:
          'https://secure.3gdirectpay.com/payv2.php?ID=D7B8F9E2-1A3C-4D5E-9F8A-7B6C5D4E3F2A',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createTransactionToken(
    @Body()
    data: {
      policyId: string;
      policyNumber: string;
      currency: string;
      totalAmount: number;
      vehicleRegistration: string;
      companyRef?: string;
      callbackURL?: string;
    },
  ) {
    console.log(data);
    return this.dpoIntegrationService.createTransactionToken(data);
  }

  @Post('verify/transaction-status/:transactionToken')
  @ApiOperation({ summary: 'Verify a transaction status' })
  @ApiResponse({
    status: 200,
    description: 'Transaction verified successfully',
    schema: {
      example: {
        status: '000',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  verifyTransaction(@Param('transactionToken') transactionToken: string) {
    return this.dpoIntegrationService.verifyTransaction(transactionToken);
  }

  @Post('payment-url/:transactionToken')
  @ApiOperation({ summary: 'Get payment URL for a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Payment URL generated successfully',
    schema: {
      example: {
        paymentUrl:
          'https://secure.3gdirectpay.com/payv2.php?ID=D7B8F9E2-1A3C-4D5E-9F8A-7B6C5D4E3F2A',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  getPaymentUrl(@Param('transactionToken') transactionToken: string) {
    return {
      paymentUrl: `${this.dpoIntegrationService.getPaymentUrl()}?ID=${transactionToken}`,
    };
  }
}
