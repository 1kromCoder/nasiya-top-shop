import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { DebtsModule } from './debts/debts.module';
import { DebtorModule } from './debtor/debtor.module';
import { SellerModule } from './seller/seller.module';
import { SmsModule } from './sms/sms.module';
import { ExampleModule } from './example/example.module';
import { PaymentsModule } from './payments/payments.module';
import { ImageModule } from './image/image.module';
import { PhoneModule } from './phone/phone.module';

@Module({
  imports: [
    PrismaModule,
    AdminModule,
    DebtsModule,
    DebtorModule,
    SellerModule,
    SmsModule,
    ExampleModule,
    PaymentsModule,
    ImageModule,
    PhoneModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
