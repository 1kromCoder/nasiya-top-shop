import { Module } from '@nestjs/common';
import { ImagesDebtsService } from './images-debts.service';
import { ImagesDebtsController } from './images-debts.controller';

@Module({
  controllers: [ImagesDebtsController],
  providers: [ImagesDebtsService],
})
export class ImagesDebtsModule {}
