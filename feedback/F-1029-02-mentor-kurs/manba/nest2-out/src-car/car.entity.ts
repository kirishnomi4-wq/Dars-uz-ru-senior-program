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
