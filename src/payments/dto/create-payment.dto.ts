import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 300000 })
  @IsInt()
  @IsOptional()
  amount: number;
  @ApiPropertyOptional({
    example: 0,
    required: false,
    description: 'Optional: necha oylik to‘lov qilish',
  })
  @IsInt()
  @IsOptional()
  month?: number;
  @ApiProperty({ example: '2025-07-31T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  endDate: string;
  @ApiProperty()
  @IsInt()
  debtsId: number;
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
