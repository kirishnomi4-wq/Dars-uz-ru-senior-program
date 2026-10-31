import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/infrastructure/base/base.service';
import { BookEntity } from 'src/core';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService extends BaseService<CreateBookDto, UpdateBookDto, BookEntity> {
  constructor(@InjectRepository(BookEntity) private readonly repo: Repository<BookEntity>) {
    super(repo);
  }
}
