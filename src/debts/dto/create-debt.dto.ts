import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  IsTimeZone,
} from 'class-validator';

export class CreateDebtDto {
  @ApiProperty({ example: '2025-07-31T00:00:00.000Z' })
  @IsDateString()
  date: string;
  @ApiProperty({ example: '14:12' })
  @IsString()
  time: string;
  @ApiProperty({ example: 3 })
  @IsInt()
  period: number;
  @ApiProperty({ example: 1000000 })
  @IsInt()
  amount: number;
  @ApiProperty()
  @IsString()
  note: string;
  @ApiProperty()
  @IsInt()
  debtorId: number;
}
