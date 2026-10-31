import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Sherlok Holms' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Artur Konan Doyl' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'uuid — mavjud kategoriya' })
  @IsUUID()
  categoryId: string;
}
