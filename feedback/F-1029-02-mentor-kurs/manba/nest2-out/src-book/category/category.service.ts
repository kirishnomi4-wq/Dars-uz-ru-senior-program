import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CategoryEntity } from 'src/core';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService extends BaseService<CreateCategoryDto, UpdateCategoryDto, CategoryEntity> {
  constructor(@InjectRepository(CategoryEntity) private readonly repo: Repository<CategoryEntity>) {
    super(repo);
  }
}
