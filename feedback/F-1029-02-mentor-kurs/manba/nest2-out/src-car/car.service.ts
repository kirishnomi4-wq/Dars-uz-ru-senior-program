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
