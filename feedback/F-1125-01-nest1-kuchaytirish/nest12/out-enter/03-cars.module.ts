import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller.js';
import { CarsService } from './cars.service.js';

@Module({
  controllers: [CarsController],
  providers: []
})
export class CarsModule {}
