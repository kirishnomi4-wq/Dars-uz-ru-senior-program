import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { CategoryEntity } from './category.entity';

@Entity('books')
export class BookEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  price: number;

  @Column({ default: false })
  is_featured: boolean;

  @ManyToOne(() => CategoryEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Column()
  categoryId: string;
}
