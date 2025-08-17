import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSmDto {
  @ApiProperty()
  @IsString()
  text: string;
  @ApiProperty({ example: '2025-07-31T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  date: string;
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  sent: boolean;
  @ApiProperty()
  @IsInt()
  @IsOptional()
  exampleId: number;
  @ApiProperty()
  @IsInt()
  debtorId: number;
}
