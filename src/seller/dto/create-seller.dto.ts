import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateSellerDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty({ example: '+998912345678' })
  @IsPhoneNumber()
  @IsString()
  phone: string;
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsInt()
  balance: number;
  @ApiProperty()
  @IsString()
  password: string;
  @ApiProperty()
  @IsString()
  img: string;
}
