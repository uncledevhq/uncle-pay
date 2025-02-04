import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { DpoIntegrationController } from './dpo-integration/dpo-integration.controller';
import { DpoIntegrationService } from './dpo-integration/dpo-integration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, DpoIntegrationController],
  providers: [AppService, PrismaService, DpoIntegrationService],
})
export class AppModule {}
