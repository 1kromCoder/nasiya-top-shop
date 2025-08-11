import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty()
  @IsString()
  img: string;
  @ApiProperty()
  @IsOptional()
  @IsInt()
  debtsId?: number;
  @ApiProperty()
  @IsOptional()
  @IsInt()
  debtorId?: number;
}
