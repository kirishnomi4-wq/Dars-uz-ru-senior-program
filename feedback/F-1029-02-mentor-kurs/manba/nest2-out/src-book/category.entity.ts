import { Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @Column()
  name: string;
}
