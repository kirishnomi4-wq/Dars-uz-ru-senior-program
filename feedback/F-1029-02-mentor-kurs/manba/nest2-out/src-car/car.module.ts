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
