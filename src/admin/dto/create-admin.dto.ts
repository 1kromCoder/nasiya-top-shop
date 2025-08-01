import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  password: string;
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @IsPhoneNumber()
  phone: string;
}
