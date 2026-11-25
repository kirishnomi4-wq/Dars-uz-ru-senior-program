mkdir -p src/api/car/dto
cat > src/core/entity/car.entity.ts <<'EOT'
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';

@Entity('cars')
export class CarEntity extends BaseEntity {
  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  price: number;

  @Column({ default: true })
  is_available: boolean;
}
EOT
cat >> src/core/index.ts <<'EOT'
export * from './entity/car.entity';
EOT
cat > src/api/car/dto/create-car.dto.ts <<'EOT'
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
EOT
cat > src/api/car/dto/update-car.dto.ts <<'EOT'
import { PartialType } from '@nestjs/swagger';
import { CreateCarDto } from './create-car.dto';

export class UpdateCarDto extends PartialType(CreateCarDto) {}
EOT
cat > src/api/car/car.service.ts <<'EOT'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CarEntity } from 'src/core';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService extends BaseService<CreateCarDto, UpdateCarDto, CarEntity> {
  constructor(
    @InjectRepository(CarEntity) private readonly carRepo: Repository<CarEntity>,
  ) {
    super(carRepo);
  }
}
EOT
cat > src/api/car/car.controller.ts <<'EOT'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@Body() dto: CreateCarDto) {
    return this.carService.create(dto);
  }

  @Get()
  findAll() {
    return this.carService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.carService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(id);
  }
}
EOT
cat > src/api/car/car.module.ts <<'EOT'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from 'src/core';
import { CarService } from './car.service';
import { CarController } from './car.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CarEntity])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
EOT
python3 - <<'EOF'
p='src/api/app.module.ts'; s=open(p).read()
s=s.replace("import { AuthModule } from './auth/auth.module';","import { AuthModule } from './auth/auth.module';\nimport { CarModule } from './car/car.module';")
s=s.replace("    AuthModule,\n","    AuthModule,\n    CarModule,\n")
open(p,'w').write(s)
EOF
