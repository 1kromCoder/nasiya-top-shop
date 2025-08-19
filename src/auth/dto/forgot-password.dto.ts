import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
