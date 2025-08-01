import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPhoneNumber, IsString } from 'class-validator';

export class CreatePhoneDto {
  @ApiProperty({ example: '+998909876543' })
  @IsPhoneNumber()
  @IsString()
  phone: string;
  @ApiProperty()
  @IsInt()
  debtorId: number;
}
