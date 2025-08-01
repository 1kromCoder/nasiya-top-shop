import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty()
  @IsString()
  img: string;
  @ApiProperty()
  @IsInt()
  debtsId: number;
  @ApiProperty()
  @IsInt()
  debtorId: number;
}
