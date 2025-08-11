import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateImageDebtsDto {
  @ApiProperty()
  @IsString()
  img: string;
  @ApiProperty()
  @IsOptional()
  @IsInt()
  debtsId?: number;
}
