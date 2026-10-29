#!/bin/bash
# Haqiqiy Nest chiqishlarini yig'ish: har holat uchun log + curl natijalari out/ ga yoziladi
cd "$(dirname "$0")/cars-api" || exit 1
OUT=../out
start_and_probe() { # $1=nom, keyin curl manzillari
  local name=$1; shift
  fuser -k 3000/tcp >/dev/null 2>&1; sleep 0.5
  setsid npx nest start > "$OUT/$name.log" 2>&1 &
  local pg=$!
  for i in $(seq 1 60); do
    if grep -q -E "successfully started|Error|error TS|Cannot find" "$OUT/$name.log"; then break; fi
    sleep 0.5
  done
  sleep 1
  for u in "$@"; do
    echo "### curl $u" >> "$OUT/$name.curl"
    if [[ "$u" == POST* ]]; then
      curl -s -i -X POST -H 'Content-Type: application/json' -d '{"brand":"Chevrolet","model":"Cobalt","price":145}' "http://localhost:3000${u#POST }" >> "$OUT/$name.curl" 2>&1
    else
      curl -s -i "http://localhost:3000$u" >> "$OUT/$name.curl" 2>&1
    fi
    echo >> "$OUT/$name.curl"
  done
  kill -- -$pg >/dev/null 2>&1; fuser -k 3000/tcp >/dev/null 2>&1; sleep 0.5
  echo "== $name tayyor"
}

# 0. toza loyiha
start_and_probe 00-fresh "/" "/cars"

# 1. CLI bilan cars moduli
{ npx nest g module cars; npx nest g controller cars --no-spec; npx nest g service cars --no-spec; } > $OUT/01-cli.txt 2>&1
cp src/cars/cars.module.ts $OUT/01-cars.module.ts; cp src/cars/cars.controller.ts $OUT/01-cars.controller.ts; cp src/cars/cars.service.ts $OUT/01-cars.service.ts; cp src/app.module.ts $OUT/01-app.module.ts
start_and_probe 01-generated "/cars"

# 2. haqiqiy kod: service ro'yxat, controller GET/GET:id/POST
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
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
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
TS
start_and_probe 02-working "/cars" "/cars/1" "/cars/99" "POST /cars" "/cars"

# 3. Buzish 1: providers dan CarsService olib tashlandi
cp src/cars/cars.module.ts /tmp/cars.module.bak
sed -i 's/providers: \[CarsService\]/providers: []/' src/cars/cars.module.ts
start_and_probe 03-break-provider "/cars"
cp /tmp/cars.module.bak src/cars/cars.module.ts

# 4. Buzish 2: @Injectable() olib tashlandi (bog'liqliksiz service)
cp src/cars/cars.service.ts /tmp/cars.service.bak
sed -i 's/^@Injectable()$//' src/cars/cars.service.ts
start_and_probe 04-break-injectable "/cars"
cp /tmp/cars.service.bak src/cars/cars.service.ts

# 5. Buzish 3: AppModule imports dan CarsModule olib tashlandi
cp src/app.module.ts /tmp/app.module.bak
sed -i 's/imports: \[CarsModule\]/imports: []/' src/app.module.ts
start_and_probe 05-break-import "/cars" "/"
cp /tmp/app.module.bak src/app.module.ts

# 6. Buzish 4: @Controller dekoratori olib tashlandi
cp src/cars/cars.controller.ts /tmp/cars.controller.bak
sed -i "s/^@Controller('cars')$//" src/cars/cars.controller.ts
start_and_probe 06-break-controller "/cars"
cp /tmp/cars.controller.bak src/cars/cars.controller.ts

# 7. Buzish 5: service xato tashlaydi (oddiy Error) — Nest 500 qanday qaytaradi
cp src/cars/cars.service.ts /tmp/cars.service.bak
sed -i "s/throw new NotFoundException(\`Car with id \${id} not found\`);/throw new Error('topilmadi');/" src/cars/cars.service.ts
start_and_probe 07-plain-error "/cars/99"
cp /tmp/cars.service.bak src/cars/cars.service.ts

# yakuniy holat
start_and_probe 08-final "/cars" "/cars/2"
echo ALL-DONE
