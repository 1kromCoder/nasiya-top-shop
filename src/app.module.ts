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
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { MulterController } from './multer/multer.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/file',
    }),
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
    AuthModule,
    MulterModule,
  ],
  controllers: [AppController, MulterController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
