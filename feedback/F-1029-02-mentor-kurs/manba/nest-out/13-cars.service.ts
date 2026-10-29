import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PricingService } from './pricing.service';

export interface Car {
  id: number;
  brand: string;
  model: string;
  price: number;
}

// @Injectable()  <- ATAYLAB O'CHIRILDI
export class CarsService {
  constructor(@Inject(PricingService) private readonly pricing: PricingService) {}

  private cars: Car[] = [
    { id: 1, brand: 'Chevrolet', model: 'Malibu', price: 250 },
    { id: 2, brand: 'Kia', model: 'K5', price: 320 },
  ];

  findAll(): Car[] {
    return this.cars.map((c) => ({ ...c, price: this.pricing.withDiscount(c.price) }));
  }

  findOne(id: number): Car {
    const car = this.cars.find((c) => c.id === id);
    if (!car) throw new NotFoundException(`Car with id ${id} not found`);
    return car;
  }

  create(data: Omit<Car, 'id'>): Car {
    const car: Car = { id: this.cars.length + 1, ...data };
    this.cars.push(car);
    return car;
  }
}
