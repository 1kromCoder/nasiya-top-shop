import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  otp: string;
  @ApiProperty()
  @MinLength(6)
  @IsString()
  newPassword: string;
}
