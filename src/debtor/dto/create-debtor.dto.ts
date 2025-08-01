import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateDebtorDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty({ example: 'Chilonzor 9v' })
  @IsString()
  address: string;
  @ApiProperty()
  @IsString()
  note: string;
  @ApiProperty()
  @IsInt()
  sellerId: number;
}
