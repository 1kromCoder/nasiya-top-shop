import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class DebtDateDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;
}
