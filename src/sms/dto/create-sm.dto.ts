import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsString } from 'class-validator';

export class CreateSmDto {
  @ApiProperty()
  @IsString()
  text: string;
  @ApiProperty({ example: '2025-07-31T00:00:00.000Z' })
  @IsDateString()
  date: string;
  @ApiProperty()
  @IsBoolean()
  sent: boolean;
  @ApiProperty()
  @IsInt()
  exampleId: number;
  @ApiProperty()
  @IsInt()
  debtorId: number;
}
