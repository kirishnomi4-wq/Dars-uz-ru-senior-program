import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({ example: 'Chevrolet' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'Malibu' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 250 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_available?: boolean;
}
