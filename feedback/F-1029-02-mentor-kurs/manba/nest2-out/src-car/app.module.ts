import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config';
import { Module } from '@nestjs/common';


import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CarModule } from './car/car.module';


const { url, sync } = config.DB;

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: url,
      synchronize: sync,
      autoLoadEntities: true,
      entities: ['dist/core/entity/*.entity{.ts,.js}'],
    }),
    AdminModule,
    AuthModule,
    CarModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
