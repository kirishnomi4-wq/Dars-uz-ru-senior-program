import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  findAll() {
    return this.carsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: { brand: string; model: string; price: number }) {
    return this.carsService.create(body);
  }
}
