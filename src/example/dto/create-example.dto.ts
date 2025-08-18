import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateExampleDto {
  @ApiProperty()
  @IsString()
  text: string;
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
