import { PartialType } from '@nestjs/swagger';
import { CreateImageDebtsDto } from './create-images-debt.dto';

export class UpdateImagesDebtDto extends PartialType(CreateImageDebtsDto) {}
