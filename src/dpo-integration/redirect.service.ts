import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DpoIntegrationService } from './dpo-integration.service';

@Injectable()
export class RedirectService {
  constructor(
    private prisma: PrismaService,
    private dpoIntegrationService: DpoIntegrationService,
  ) {}

  async handleSuccess(transactionToken: string) {
    const verificationResult =
      await this.dpoIntegrationService.verifyTransaction(transactionToken);

    if (verificationResult.status === '000') {
      const transaction = await this.prisma.transaction.findUnique({
        where: { transactionToken },
      });
      return { status: 'success', transaction };
    }

    return { status: 'error', message: 'Transaction verification failed' };
  }

  async handlePending(transactionToken: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionToken },
    });

    if (!transaction) {
      return { status: 'error', message: 'Transaction not found' };
    }

    return { status: 'pending', transaction };
  }

  async handleFailed(transactionToken: string) {
    const transaction = await this.prisma.transaction.update({
      where: { transactionToken },
      data: { status: 'failed' },
    });

    return { status: 'failed', transaction };
  }
}
