#!/bin/bash
# Audit №2 (29.10) uchun qo'shimcha HAQIQIY chiqishlar. Ishlatish: bash drive2.sh <cars-api loyiha papkasi>
# Holatlar: 10 bazaviy · 11 bo'sh POST · 12 @Injectable'siz + bog'liqlik · 13 @Inject parametr-dekoratori bilan, @Injectable'siz
#           14 @Injectable qaytarildi · 15 baza porti noto'g'ri (ECONNREFUSED) · 16 .env yo'q · 17 parol noto'g'ri · 18 baza mavjud emas
P="${1:?loyiha papkasi}"; OUT="$(cd "$(dirname "$0")" && pwd)/nest-out"; cd "$P" || exit 1
{ echo "node $(node --version)"; echo "nest $(nest --version)"; node -e "console.log('@nestjs/core', require('@nestjs/core/package.json').version)"; } > "$OUT/10-versions.txt"
run() { # $1=nom; env: PROBES (bo'sh ajratilgan), EXTRA_ENV
  local name=$1; fuser -k 3000/tcp >/dev/null 2>&1; sleep 0.5; : > "$OUT/$name.curl"
  env $EXTRA_ENV setsid npx nest start > "$OUT/$name.log" 2>&1 & local pg=$!
  for i in $(seq 1 100); do grep -q "successfully started" "$OUT/$name.log" && break; kill -0 $pg 2>/dev/null || break; sleep 0.5; done; sleep 1
  for u in $PROBES; do
    echo "### $u" >> "$OUT/$name.curl"
    case "$u" in
      POST-empty:*) curl -s -i -X POST -H 'Content-Type: application/json' -d '{}' "http://localhost:3000${u#POST-empty:}" >> "$OUT/$name.curl" 2>&1 ;;
      POST-nobody:*) curl -s -i -X POST "http://localhost:3000${u#POST-nobody:}" >> "$OUT/$name.curl" 2>&1 ;;
      *) curl -s -i "http://localhost:3000$u" >> "$OUT/$name.curl" 2>&1 ;;
    esac; echo >> "$OUT/$name.curl"
  done
  kill -- -$pg >/dev/null 2>&1; fuser -k 3000/tcp >/dev/null 2>&1; sleep 0.5; sed -i 's/\x1b\[[0-9;]*m//g' "$OUT/$name.log"; echo "== $name tayyor"
}
mkdir -p src/cars
cat > src/cars/cars.module.ts <<'TS'
import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  controllers: [CarsController],
  providers: [CarsService]
})
export class CarsModule {}
TS
cat > src/cars/cars.service.ts <<'TS'
import { Injectable, NotFoundException } from '@nestjs/common';

export interface Car {
  id: number;
  brand: string;
  model: string;
  price: number;
}

@Injectable()
export class CarsService {
  private cars: Car[] = [
    { id: 1, brand: 'Chevrolet', model: 'Malibu', price: 250 },
    { id: 2, brand: 'Kia', model: 'K5', price: 320 },
  ];

  findAll(): Car[] {
    return this.cars;
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
TS
cat > src/cars/cars.controller.ts <<'TS'
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  findAll() { return this.carsService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: { brand: string; model: string; price: number }) {
    return this.carsService.create(body);
  }
}
TS
cat > src/app.module.ts <<'TS'
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [CarsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
TS
cp src/cars/cars.service.ts /tmp/cars.service.ok.ts

# 10 bazaviy · 11 bo'sh POST
PROBES="/cars /cars/99" run 10-base
PROBES="POST-empty:/cars POST-nobody:/cars /cars" run 11-empty-post

# 12: @Injectable YO'Q, lekin konstruktorda bog'liqlik bor (PricingService)
cat > src/cars/pricing.service.ts <<'TS'
import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingService {
  withDiscount(price: number): number {
    return price > 300 ? Math.round(price * 0.9) : price;
  }
}
TS
cat > src/cars/cars.module.ts <<'TS'
import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { PricingService } from './pricing.service';

@Module({
  controllers: [CarsController],
  providers: [CarsService, PricingService]
})
export class CarsModule {}
TS
python3 - <<'PY'
import pathlib
p = pathlib.Path('src/cars/cars.service.ts'); s = p.read_text()
s = s.replace("import { Injectable, NotFoundException } from '@nestjs/common';", "import { Injectable, NotFoundException } from '@nestjs/common';\nimport { PricingService } from './pricing.service';")
s = s.replace("@Injectable()\nexport class CarsService {", "// @Injectable()  <- ATAYLAB O'CHIRILDI\nexport class CarsService {\n  constructor(private readonly pricing: PricingService) {}\n")
s = s.replace("  findAll(): Car[] {\n    return this.cars;\n  }", "  findAll(): Car[] {\n    return this.cars.map((c) => ({ ...c, price: this.pricing.withDiscount(c.price) }));\n  }")
p.write_text(s)
PY
cp src/cars/cars.service.ts "$OUT/12-cars.service.ts"
PROBES="/cars /cars/1" run 12-no-injectable-with-dep

# 13: @Injectable yo'q, lekin @Inject(PricingService) parametr-dekoratori bor
python3 - <<'PY'
import pathlib
p = pathlib.Path('src/cars/cars.service.ts'); s = p.read_text()
s = s.replace("import { Injectable, NotFoundException } from '@nestjs/common';", "import { Inject, Injectable, NotFoundException } from '@nestjs/common';")
s = s.replace("constructor(private readonly pricing: PricingService) {}", "constructor(@Inject(PricingService) private readonly pricing: PricingService) {}")
p.write_text(s)
PY
cp src/cars/cars.service.ts "$OUT/13-cars.service.ts"
PROBES="/cars" run 13-no-injectable-inject-param

# 14: @Injectable qaytarildi (oddiy konstruktor) — nazorat
python3 - <<'PY'
import pathlib
p = pathlib.Path('src/cars/cars.service.ts'); s = p.read_text()
s = s.replace("import { Inject, Injectable, NotFoundException }", "import { Injectable, NotFoundException }")
s = s.replace("constructor(@Inject(PricingService) private readonly pricing: PricingService) {}", "constructor(private readonly pricing: PricingService) {}")
s = s.replace("// @Injectable()  <- ATAYLAB O'CHIRILDI\nexport class CarsService {", "@Injectable()\nexport class CarsService {")
p.write_text(s)
PY
PROBES="/cars" run 14-injectable-back

# 15–18: TypeORM + PostgreSQL ulanish xatolari (o'quvchi loyihasi kabi: DEV_DB_URL)
npm i @nestjs/typeorm typeorm pg > "$OUT/15-npm-install.txt" 2>&1
cat > src/cars/car.entity.ts <<'TS'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Car {
  @PrimaryGeneratedColumn() id: number;
  @Column() brand: string;
  @Column() model: string;
  @Column() price: number;
}
TS
cat > src/app.module.ts <<'TS'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ type: 'postgres', url: process.env.DEV_DB_URL, autoLoadEntities: true, synchronize: true }),
    CarsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
TS
EXTRA_ENV="DEV_DB_URL=postgres://postgres:postgres@127.0.0.1:5433/nest_db" PROBES="/cars" run 15-db-port-closed
EXTRA_ENV="" PROBES="/cars" run 16-db-no-env
EXTRA_ENV="DEV_DB_URL=postgres://postgres:notogri@127.0.0.1:5432/postgres" PROBES="/cars" run 17-db-wrong-password
EXTRA_ENV="DEV_DB_URL=postgres://postgres:postgres@127.0.0.1:5432/nest_db_yoq" PROBES="/cars" run 18-db-not-exist
echo "HAMMASI TAYYOR"
