import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as xml2js from 'xml2js';

@Injectable()
export class DpoIntegrationService {
  private readonly baseUrl: string;
  private readonly companyToken: string;
  private readonly serviceId: string;
  private readonly paymentUrl: string;
  private readonly redirectUrl: string;
  private readonly backUrl: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('DPO_BASE_URL');
    this.companyToken = this.configService.get<string>('DPO_COMPANY_TOKEN');
    this.redirectUrl = this.configService.get<string>('DPO_REDIRECT_URL');
    this.paymentUrl = this.configService.get<string>('DPO_PAYMENT_URL');
    this.serviceId = this.configService.get<string>('DPO_SERVICE_ID');
    this.backUrl = this.configService.get<string>('DPO_BACK_URL');
  }

  async createTransactionToken(data: {
    policyId: string;
    policyNumber: string;
    currency: string;
    totalAmount: number;
    vehicleRegistration: string;
    companyRef?: string;
  }) {
    const transaction = await this.prisma.transaction.create({
      data: {
        ...data,
        status: 'pending',
      },
    });

    const xmlPayload = `<?xml version=\"1.0\" encoding=\"utf-8\"?>
      <API3G>
        <CompanyToken>${this.companyToken}</CompanyToken>
        <Request>createToken</Request>
        <Transaction>
          <PaymentAmount>${data.totalAmount}</PaymentAmount>
          <PaymentCurrency>${data.currency}</PaymentCurrency>
          <CompanyRef>${data.companyRef || transaction.id}</CompanyRef>
          <RedirectURL>${this.redirectUrl}</RedirectURL>
          <BackURL>${this.redirectUrl}</BackURL>
          <CompanyRefUnique>1</CompanyRefUnique>
          <PTL>5</PTL>
        </Transaction>
        <Services>
    <Service>
      <ServiceType>${this.serviceId}</ServiceType>
      <ServiceDescription>Insurance Payment</ServiceDescription>
      <ServiceDate>${new Date().toISOString().slice(0, 10).replace(/-/g, '/')} ${new Date().toTimeString().slice(0, 5)}</ServiceDate>
    </Service>
  </Services>
      </API3G>`;

    try {
      const response = await axios.post(`${this.baseUrl}/API/v6/`, xmlPayload, {
        headers: { 'Content-Type': 'application/xml' },
      });

      const result = await xml2js.parseStringPromise(response.data);
      const transactionToken = result.API3G.TransToken[0];

      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { transactionToken },
      });

      return {
        transactionToken,
        paymentUrl: `https://secure.3gdirectpay.com/payv2.php?ID=${transactionToken}`,
      };
    } catch (error) {
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'failed' },
      });
      throw error;
    }
  }

  async verifyTransaction(transactionToken: string) {
    const xmlPayload = `<?xml version=\"1.0\" encoding=\"utf-8\"?>
      <API3G>
        <CompanyToken>${this.companyToken}</CompanyToken>
        <Request>verifyToken</Request>
        <TransactionToken>${transactionToken}</TransactionToken>
      </API3G>`;

    try {
      const response = await axios.post(`${this.baseUrl}/API/v6/`, xmlPayload, {
        headers: { 'Content-Type': 'application/xml' },
      });

      const result = await xml2js.parseStringPromise(response.data);
      const status = result.API3G.Result[0];

      await this.prisma.transaction.update({
        where: { transactionToken },
        data: { status: status === '000' ? 'completed' : 'failed' },
      });

      return { status };
    } catch (error) {
      throw error;
    }
  }

  getPaymentUrl(): string {
    return this.configService.get<string>('PAYMENT_URL');
  }
}
