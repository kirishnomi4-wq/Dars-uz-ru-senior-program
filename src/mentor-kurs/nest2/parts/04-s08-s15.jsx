
// ============================================================
//  3-BOSQICH · resurs: car, 5 qatlam bir marta (8–15)
// ============================================================
const CAR_ENT_LINES = ts(String.raw`
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
}`, { 4: { id: 'ent' }, 5: { id: 'ext' }, 6: { id: 'col' }, 7: { id: 'col' }, 9: { id: 'col' }, 10: { id: 'col' }, 12: { id: 'col' }, 13: { id: 'col' }, 15: { id: 'col' }, 16: { id: 'col' } });
const BASE_ENT_LINES = ts(String.raw`
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}`);
const CORE_IDX_LINES = ts(String.raw`
// Entity export
export * from './entity/Base.entity';
export * from './entity/admin.entity';
export * from './entity/car.entity';

// Repository export
export * from './repository/admin.repository';`, { 4: { neu: true, id: 'exp' } });
const S8 = {
  kicker: '3-bosqich · Entity', title: 'car resursi, 1-qatlam: Entity — jadval shakli',
  segments: [
    sg('a', "Loyihaga <b>bitta resurs</b> qo'shamiz — o'quvchi m4a-03 dagi <b>car</b>, besh qatlam bilan", "Loyihani bilasiz. Endi unga bitta resurs qo'shamiz: mashinalar, car. Aynan o'quvchi m4a-03 darsida qiladigan ish, o'sha nomlar bilan. Resurs besh qatlam: Entity, DTO, Service, Controller va Module. Har qatlam yonida loyihadagi admin fayli namuna bo'lib turadi.", { focus: [] }),
    sg('b', "Entity — <b>jadval shakli</b>: klass jadval, <code>@Column</code> yozilgan har maydon — ustun", "Birinchi qatlam Entity, core papkasida. Entity bazadagi jadvalning shakli: klass jadval, ustiga Column decorator'i yozilgan har maydon bitta ustun. SQL yozilmaydi: TypeORM jadvalni shu klassdan o'zi yaratadi.", { focus: ['ent', 'col'] }),
    sg('c', "<code>BaseEntity</code>dan meros — <b>id (uuid) va ikki sana tekin</b>; <code>id</code>ni qayta yozish xato", "Klass Base entity'dan meros oladi va undan uchta ustun tekin keladi: id, yaratilgan va o'zgartirilgan vaqt. id raqam emas, uuid, o'ttiz olti belgili matn. O'quvchi id ustunini qo'lda yozsa, bu takror: o'quvchi darsida aynan shu xato sifatida ko'rsatiladi.", { focus: ['ext'] }),
    sg('d', "To'rt o'z ustuni; yangi Entity <b><code>core/index.ts</code>ga ham</b> yoziladi, aks holda topilmaydi", "O'z ustunlarimiz to'rtta: brand va model matn, price raqam, is available standart qiymati true. Va bitta loyiha qoidasi: core papkasidagi index ts hamma Entity'ni bir joydan beradi, yangi Entity shu yerga qo'shiladi. Qo'shilmasa, boshqa fayllar Car entity'ni topa olmaydi, TypeScript xato beradi.", { focus: ['col'] }),
    sg('e', "Xulosa: Entity — jadval shakli; jadvalning o'zi <b>modul ulangach</b>, server ishga tushganda paydo bo'ladi", "Xulosa: Entity jadval shakli, u core papkasida, Base entity'dan meros bilan. Bazada jadval hozircha yo'q: TypeORM uni server ishga tushganda, resurs moduli ulangandan keyin yaratadi. O'quvchi darsi Entity'ni javon chizmasi deydi.", { focus: [] }),
  ],
};
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg, beat }) => <>
    <LayerPath at={0} />
    <Ide files={tree(BASE, [F.baseEnt, F.aEnt], beat >= 1 ? [F.cEnt] : [])} active={beat >= 3 && seg.id !== 'e' ? F.coreIdx : (beat >= 1 ? F.cEnt : F.aEnt)} fresh={[F.cEnt]}>
      {beat === 0
        ? <CodePanel file={F.aEnt + ' · ' + t('loyihadagi namuna', 'образец из проекта')} lines={ts(String.raw`
@Entity('admins')
export class AdminEntity extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  hashed_password: string;
  …
  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
  role: UserRole;
}`)} />
        : beat < 3 ? <CodePanel file={F.cEnt} lines={CAR_ENT_LINES} focus={seg.focus} /> : null}
      {beat === 2 && <CodePanel file={F.baseEnt} lines={BASE_ENT_LINES} />}
      {beat >= 3 && <CodePanel file={F.coreIdx} lines={CORE_IDX_LINES} focus={beat === 3 ? ['exp'] : []} />}
      {beat === 3 && <Term er lines={term(t(String.raw`error TS2305: Module '"src/core"' has no exported member 'CarEntity'.   ← export yozilmasa`, String.raw`error TS2305: Module '"src/core"' has no exported member 'CarEntity'.   ← если не написан export`))} />}
    </Ide>
  </>} />;
}

// ============================================================
//  9 · DTO va ValidationPipe
// ============================================================
const CDTO_LINES = ts(String.raw`
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({ example: 'Chevrolet' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'Malibu' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 250 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_available?: boolean;
}`, { 5: { id: 'api' }, 6: { id: 'rule' }, 7: { id: 'rule' }, 10: { id: 'api' }, 11: { id: 'rule' }, 12: { id: 'rule' }, 15: { id: 'api' }, 16: { id: 'rule' }, 19: { id: 'api' }, 20: { id: 'rule' }, 21: { id: 'rule' } });
const UDTO_LINES = ts(String.raw`
import { PartialType } from '@nestjs/swagger';
import { CreateCarDto } from './create-car.dto';

export class UpdateCarDto extends PartialType(CreateCarDto) {}`, { 1: { id: 'pkg' }, 4: { id: 'pt' } });
const PIPE_LINES = ts(String.raw`
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);`, { 3: { id: 'w' }, 4: { id: 'w' } });
const S9 = {
  kicker: '3-bosqich · DTO', title: "2-qatlam: DTO — kiruvchi ma'lumot qoidalari, 400 shu yerdan",
  segments: [
    sg('a', "Jadval shakli bor. DTO — <b>so'rovdan keladigan</b> ma'lumot shakli va qoidalari", "Jadval shakli tayyor. Ikkinchi qatlam so'rovdan keladigan ma'lumot: DTO. Entity bazadagi jadval, DTO esa so'rovdagi ma'lumot, ikkalasini adashtirmang. DTO'lar resurs papkasining ichidagi dto papkasida turadi.", { focus: [], file: F.cCdto }),
    sg('b', "Har maydonda qoida: <code>brand</code>, <code>model</code> — matn va bo'sh emas, <code>price</code> — raqam, <code>is_available</code> — ixtiyoriy", "Yaratish DTO'sida har maydon ustida qoida: brand va model matn bo'lsin va bo'sh bo'lmasin, price raqam bo'lsin, is available ixtiyoriy. Har maydonda yana bitta decorator bor, Swagger uchun misol: Swagger'dagi tayyor JSON shu misollardan yig'iladi.", { focus: ['rule', 'api'], file: F.cCdto }),
    sg('c', "O'zgartirish DTO'si — <b><code>PartialType</code></b>: o'sha maydonlar, hammasi ixtiyoriy", "O'zgartirish DTO'si bitta qator: Partial type, ya'ni yaratishdagi maydonlar, lekin hammasi ixtiyoriy, PATCH'da faqat o'zgargan maydon yuboriladi. Partial type nestjs swagger paketidan olinadi. Boshqa paketdan olinsa ham ishlaydi, lekin Swagger'da maydonlar yo'qoladi, buni sinab ko'rdik.", { focus: ['pt', 'pkg'], file: F.cUdto }),
    sg('d', "Qoidalarni <b>global ValidationPipe</b> tekshiradi: DTO'da yo'q maydon ham <b>400</b>", "Qoidalarni kim tekshiradi? Loyihada global ValidationPipe yoqilgan. cars api'da bo'sh so'rov ikki yuz bir qaytargan edi; bu loyihada qoida buzilsa to'rt yuz, xabarda hamma buzilgan qoida sanaladi. Yana bir sozlama: DTO'da yo'q maydon kelsa ham to'rt yuz, property should not exist.", { focus: ['w'], file: F.appSvc }),
    sg('e', "Xulosa: 400 ko'rsangiz — xabar DTO'dagi <b>qaysi qoida</b> buzilganini aytadi", "Xulosa: DTO ikki fayl, kiruvchi ma'lumot qoidalari faqat shu yerda. To'rt yuz ko'rsangiz, xabarni o'qing: qaysi maydon, qaysi qoida. Haqiqiy javoblarni o'n uchinchi ekranda ko'ramiz. O'quvchi darsi DTO'ni buyurtma anketasi deydi.", { focus: [], file: F.cCdto }),
  ],
};
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg, beat }) => <>
    <LayerPath at={1} />
    <Ide files={tree(BASE, [F.cEnt, F.cCdto, F.cUdto])} active={seg.file === F.appSvc ? F.appSvc : seg.file} fresh={[F.cCdto, F.cUdto]}>
      {seg.file === F.appSvc
        ? <CodePanel file={F.appSvc + ' · 18–24'} lines={PIPE_LINES} focus={seg.focus} />
        : seg.file === F.cUdto
          ? <><CodePanel file={F.cUdto} lines={UDTO_LINES} focus={seg.focus} /><div className="n2-grid2">
              <div className="mk-card"><h5>@nestjs/swagger</h5><div style={{ fontSize: 13 }}>{t("Swagger'da UpdateCarDto: brand · model · price · is_available", 'В Swagger UpdateCarDto: brand · model · price · is_available')}</div></div>
              <div className="mk-card" style={{ borderColor: T.accent }}><h5 style={{ color: T.accent }}>@nestjs/mapped-types</h5><div style={{ fontSize: 13 }}>{t("Swagger'da UpdateCarDto: properties: {} — maydonlar yo'q (PATCH baribir 200)", 'В Swagger UpdateCarDto: properties: {} — полей нет (PATCH всё равно 200)')}</div></div>
            </div></>
          : <CodePanel file={F.cCdto} lines={seg.id === 'e' ? CDTO_LINES.map((l, k) => ({ ...l, n: k + 1 })).filter((l) => String(l.h).trim() !== '') : CDTO_LINES} focus={seg.focus} />}
      {beat === 1 && <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">Swagger · Example Value</div><pre className="n2-json">{'{ "brand": "Chevrolet", "model": "Malibu", "price": 250, "is_available": true }'}</pre></div>}
    </Ide>
  </>} />;
}

// ============================================================
//  10 · BaseService
// ============================================================
const BASESVC_LINES = ts(String.raw`
export class BaseService<CreateDto, UpdateDto, Entity> {
  constructor(private readonly repository: Repository<any>) {}

  async create(dto: CreateDto): Promise<ISuccessRes> {
    let data = this.repository.create({ ...dto }) as any as Entity;
    data = await this.repository.save(data);
    return successRes(data, 201);
  }
  async findAll(options?) { … return successRes(data); }
  async findAllWithPagination(options?) { … }
  async findOneBy(options) { … }
  async findOneById(id: string, options?) {
    …
    if (!data) {
      throw new HttpException('not found', 404);
    }
    return successRes(data);
  }
  async update(id: string, dto: UpdateDto) { await this.findOneById(id); … }
  async remove(id: string) { await this.findOneById(id); … return successRes({}); }
}`, { 1: { id: 'cls' }, 2: { id: 'repo' }, 4: { id: 'm' }, 7: { id: 'res' }, 9: { id: 'm' }, 10: { id: 'm' }, 11: { id: 'm' }, 12: { id: 'm' }, 15: { id: 'nf' }, 17: { id: 'res' }, 19: { id: 'm' }, 20: { id: 'm' } });
const S10 = {
  kicker: '3-bosqich · Service', title: 'BaseService — CRUD bir marta yozilgan, hamma resurs meros oladi',
  segments: [
    sg('a', "Nest-1 da CRUD'ni o'zingiz yozgansiz — bu yerda u <b>bir marta, BaseService'da</b> yozilgan", "Uchinchi qatlam Service, lekin avval uning poydevori. Nest birinchi darsida findAll, findOne va create'ni o'zingiz yozgansiz. Bu loyihada ular bir marta, infrastructure papkasidagi Base service'da yozilgan va hamma resurs uchun ishlaydi.", { focus: ['cls', 'repo'] }),
    sg('b', "<b>Yetti metod</b>: yaratish, ro'yxat (oddiy va sahifalab), bittasini topish (ikki usul), o'zgartirish, o'chirish", "Base service'da yettita metod: yaratish, oddiy va sahifalangan ro'yxat, bittasini topishning ikki usuli, o'zgartirish va o'chirish. Yozuv topilmasa hammasi bir xil javob beradi: to'rt yuz to'rt, not found.", { focus: ['m', 'nf'] }),
    sg('c', "Har metod javobni <code>successRes</code> bilan qaytaradi — <b>beshinchi ekrandagi o'sha shakl</b>", "Har metod javobni successRes orqali qaytaradi, beshinchi ekrandagi o'sha shakl: yaratishda statusCode ikki yuz bir, qolganida ikki yuz. Shuning uchun hamma resursning javobi bir xil ko'rinadi.", { focus: ['res'] }),
    sg('d', "Xulosa: CRUD <b>qayta yozilmaydi</b>; o'ziga xos ish bo'lsa — faqat o'sha metod ustiga yoziladi", "Xulosa: yangi resursda CRUD qayta yozilmaydi, u Base service'dan meros. O'ziga xos ish kerak bo'lsa, masalan admin'da parolni shifrlash, faqat o'sha metod ustiga yoziladi. O'quvchi darsi Base service'ni tayyor retsept kitobi deydi.", { focus: [] }),
  ],
};
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg, beat }) => <>
    <LayerPath at={2} />
    <Ide files={tree(BASE, [F.cEnt, F.cCdto, F.cUdto, F.baseSvc, F.okRes])} active={F.baseSvc}>
      <CodePanel file={F.baseSvc} lines={BASESVC_LINES} focus={seg.focus} />
      {beat === 2 && <Block at={2} beat={beat}><CodePanel file={F.okRes} lines={ts(String.raw`
export const successRes = (data: any, statusCode = 200): ISuccessRes => {
  return { statusCode, message: 'success', data };
};`)} /></Block>}
      {beat < 2 && <Block at={0} beat={beat}><div className="n2-cmp">
        <div className="mk-card"><h5>Nest-1 · cars.service.ts</h5><div style={{ fontSize: 13.5 }}>{t('27 satr: massiv, findAll, findOne, create — har resursda qaytadan', '27 строк: массив, findAll, findOne, create — заново в каждом ресурсе')}</div></div>
        <div className="mk-card" style={{ borderColor: PART.svc }}><h5 style={{ color: PART.svc }}>{t("o'quvchi reposi · car.service.ts", 'репозиторий ученика · car.service.ts')}</h5><div style={{ fontSize: 13.5 }}>{t('ish qismi 8 satr — CRUD BaseService\'dan', 'рабочая часть 8 строк — CRUD из BaseService')}</div></div>
      </div></Block>}
    </Ide>
  </>} />;
}

// ============================================================
//  11 · Service va Repository
// ============================================================
const CSVC_LINES = ts(String.raw`
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
}`, { 9: { id: 'inj' }, 10: { id: 'ext' }, 11: { id: 'repo' }, 12: { id: 'repo' }, 13: { id: 'repo' }, 14: { id: 'super' }, 15: { id: 'super' } });
function DiScheme({ on }) {
  const box = (k, c, h, d, f) => <div className={`mk-box${on === k ? ' hl' : ''}`} style={{ '--c': c, opacity: on && on !== k && on !== 'all' ? 0.55 : 1 }}><h4>{h}</h4><p>{d}</p><div style={{ font: `600 11px ${MONO}`, color: T.ink3, marginTop: 6 }}>{f}</div></div>;
  return <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">{t("Repository qayerdan keladi — Nest-1 dagi Dependency Injection, uch qadam", 'Откуда берётся Repository — Dependency Injection из Nest-1, три шага')}</div>
    <div className="mk-row">
      {box('mod', PART.mod, '1 · forFeature([CarEntity])', t('modul: «shu jadval kerak»', 'модуль: «нужна эта таблица»'), 'car.module.ts')}
      <div className="mk-arrow on">→</div>
      {box('orm', N2.entity, '2 · TypeORM', t('Repository<CarEntity> instance yasaydi', 'создаёт instance Repository<CarEntity>'), 'TypeOrmModule')}
      <div className="mk-arrow on">→</div>
      {box('svc', PART.svc, '3 · @InjectRepository', t('konstruktorga beriladi', 'передаётся в конструктор'), 'car.service.ts')}
    </div>
  </div>;
}
const S11 = {
  kicker: '3-bosqich · Service', title: '3-qatlam: Service — meros, Repository va super',
  segments: [
    sg('a', "<code>CarService</code> — <code>@Injectable</code> va BaseService'dan meros: ish qismi <b>sakkiz satr</b>, metod yo'q", "Endi car service. Ustida Injectable, Nest birinchi darsidagidek. Klass Base service'dan meros oladi, uchta tip bilan: ikki DTO va Entity. Ish qismi sakkiz satr, birorta metod yozilmagan.", { focus: ['inj', 'ext'], di: null }),
    sg('b', "Konstruktorda <b>Repository</b> so'raladi va <b><code>super</code></b> orqali BaseService'ga beriladi", "Konstruktorda bitta dependency: shu jadvalning Repository'si, ya'ni bazaga yozish va o'qish metodlari. Keyingi qatorda u super orqali Base service'ga beriladi: endi yetti metod qaysi jadval bilan ishlashni biladi. super unutilsa, TypeScript kompilyatsiyada xato beradi.", { focus: ['repo', 'super'], di: null, err: true }),
    sg('c', "Repository'ni <b>TypeORM yasaydi</b>: modulda <code>forFeature</code> va Service'da <code>InjectRepository</code> — juft", "Repository'ni o'zingiz yozmaysiz, uni TypeORM yasaydi. Buning uchun ikki joy kerak va ular juft: resurs modulida forFeature, Service konstruktorida InjectRepository, ikkalasida ham o'sha Entity. Bu Nest birinchi darsidagi Dependency Injection, faqat instance'ni TypeORM beradi.", { focus: ['repo'], di: 'all' }),
    sg('d', "Loyihadagi namuna — <code>AdminService</code>: tuzilishi xuddi shu, ustiga <b>parol va token</b> ishi", "Yonidagi admin service ham xuddi shunday tuzilgan, faqat ishi ko'proq: parolni shifrlaydi, token beradi va server ishga tushganda superadmin yaratadi. Uning ham CRUD qismi Base service'dan keladi.", { focus: [], di: null, admin: true }),
    sg('e', "Xulosa: Service — <b>meros, Repository va <code>super</code></b>; mashinaga xos logika bo'lsa — shu yerga", "Xulosa: Service uch narsa: Base service'dan meros, Repository va super. Mashinaga xos logika chiqsa, masalan chegirma, u shu yerga yoziladi, Controller'ga emas. O'quvchi kodida CRUD qaytadan yozilgan bo'lsa, ishlaydi, lekin ortiqcha: Base service bor deb ayting.", { focus: [], di: null }),
  ],
};
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg }) => <>
    <LayerPath at={2} />
    {seg.di && <DiScheme on={seg.di} />}
    <Ide files={tree(BASE, [F.cEnt, F.cCdto, F.cUdto, F.cSvc], seg.admin ? [F.aSvc] : [])} active={seg.admin ? F.aSvc : F.cSvc} fresh={[F.cSvc]}>
      {seg.admin
        ? <CodePanel file={F.aSvc + ' · ' + t('loyihadagi namuna', 'образец из проекта')} lines={ts(t(String.raw`
@Injectable()
export class AdminService extends BaseService<CreateAdminDto, UpdateAdminDto, AdminEntity> {
  constructor(
    @InjectRepository(AdminEntity) private readonly adminRepo: AdminRepository,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(adminRepo);
  }
  async onModuleInit() { … }      // superadmin .env'dan
  async create(dto) { … }          // parolni shifrlaydi
  async signIn(dto, res) { … }     // token beradi
}`, String.raw`
@Injectable()
export class AdminService extends BaseService<CreateAdminDto, UpdateAdminDto, AdminEntity> {
  constructor(
    @InjectRepository(AdminEntity) private readonly adminRepo: AdminRepository,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(adminRepo);
  }
  async onModuleInit() { … }      // superadmin из .env
  async create(dto) { … }          // шифрует пароль
  async signIn(dto, res) { … }     // выдаёт токен
}`))} />
        : <CodePanel file={F.cSvc} lines={CSVC_LINES} focus={seg.focus} />}
      {seg.err && <Term er lines={term(t(String.raw`error TS2377: Constructors for derived classes must contain a 'super' call.   ← super unutilsa`, String.raw`error TS2377: Constructors for derived classes must contain a 'super' call.   ← если забыли super`))} />}
    </Ide>
  </>} />;
}

// ============================================================
//  12 · Controller, Module, AppModule
// ============================================================
const CCTRL_LINES = ts(String.raw`
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@Body() dto: CreateCarDto) {
    return this.carService.create(dto);
  }

  @Get()
  findAll() {
    return this.carService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.carService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(id);
  }
}`, { 5: { id: 'r' }, 6: { id: 'dto' }, 7: { id: 'r' }, 10: { id: 'r' }, 11: { id: 'r' }, 12: { id: 'r' }, 15: { id: 'r' }, 16: { id: 'r' }, 17: { id: 'id' }, 20: { id: 'r' }, 21: { id: 'dto' }, 22: { id: 'r' }, 25: { id: 'r' }, 26: { id: 'r' }, 27: { id: 'r' } });
const CMOD_LINES = ts(String.raw`
@Module({
  imports: [TypeOrmModule.forFeature([CarEntity])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}`, { 2: { id: 'ff' }, 3: { id: 'l' }, 4: { id: 'l' } });
const APPMOD_LINES = ts(String.raw`
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({ … }),
    AdminModule,
    AuthModule,
    CarModule,
  ],`, { 6: { neu: true } });
const CAR_START = term(String.raw`
[Nest] LOG [InstanceLoader] CarModule dependencies initialized
[Nest] LOG [RoutesResolver] CarController {/api/v1/car}:
[Nest] LOG [RouterExplorer] Mapped {/api/v1/car, POST} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/car, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/car/:id, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/car/:id, PATCH} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/car/:id, DELETE} route
[Nest] LOG [NestApplication] Nest application successfully started`);
const CARS_TABLE = plainLines(String.raw`
$ psql -d nestarxitechture -c "\d cars"
 id           | uuid                        | not null | uuid_generate_v4()
 created_at   | timestamp without time zone | not null | now()
 updated_at   | timestamp without time zone | not null | now()
 brand        | character varying           | not null |
 model        | character varying           | not null |
 price        | integer                     | not null |
 is_available | boolean                     | not null | true`);
const S12 = {
  kicker: '3-bosqich · Controller · Module', title: 'Controller, Module va AppModule — resurs tirik',
  segments: [
    sg('a', "Controller — <b>besh route</b>, har biri bitta satr: Service'ning mos metodini chaqiradi", "To'rtinchi qatlam Controller. Unda beshta route: yaratish, ro'yxat, bittasi, o'zgartirish va o'chirish. Har birining ichida bitta satr, Service'ning mos metodi chaqiriladi, logika yo'q. Bittasini topish metodi Base service'da findOneById deb ataladi, boshqa nom yozilsa TypeScript xato beradi.", { focus: ['r', 'id'], at: 3 }),
    sg('b', "Kirish parametrining tipi <b>DTO</b> — ValidationPipe aynan shu klass qoidalarini tekshiradi", "Yaratish va o'zgartirish route'larida kirish parametrining tipi DTO. Bu shunchaki yozuv emas: ValidationPipe aynan shu klassning qoidalarini tekshiradi. Bu Controller'da Guard yo'q, demak hamma route tokensiz ochiq, o'quvchi darsida ham shunday.", { focus: ['dto'], at: 3 }),
    sg('c', "Module — <b>uch ro'yxat</b>; keyin <b>AppModule</b>'ga ulanadi, aks holda route'lar yo'q", "Beshinchi qatlam Module, uchta ro'yxat: imports'da forFeature, controllers'da Controller, providers'da Service. Va oxirgi qadam bosh modul: app module'ning imports ro'yxatiga Car module. Bu unutilsa, server xatosiz ishga tushadi, lekin car route'lari bo'lmaydi.", { focus: ['ff', 'l'], at: 4 }),
    sg('d', "Terminalda <b>beshta Mapped</b>, bazada <code>cars</code> jadvali — uni <b>hech kim yaratmadi</b>", "Saqlaymiz, server qayta yuklanadi. Terminalda Car controller va beshta Mapped satri. Bazaga qarasak, cars jadvali paydo bo'lgan: id uuid, to'rtta ustun va ikki sana. Uni hech kim yaratmadi, synchronize Entity'dan yasadi.", { focus: [], at: 5 }),
    sg('e', "Xulosa: <b>5 qatlam — 6 fayl</b>, ustiga <code>core/index.ts</code> va AppModule'dagi bitta satr", "Xulosa: besh qatlam olti faylda, chunki DTO ikkita, va yana ikki tahrir: core index'dagi export va app module'dagi bitta satr. Terminalda car uchun Mapped bo'lmasa, birinchi ochadigan fayl app module. Endi so'rov yuboramiz.", { focus: [], at: 5 }),
  ],
};
function Screen12(p) {
  return <Lesson p={p} S={S12} scene={({ seg, beat }) => <>
    <LayerPath at={seg.at} />
    <Ide files={tree(BASE, CAR_ALL)} active={beat <= 1 ? F.cCtrl : beat === 2 ? F.cMod : F.appMod} fresh={beat <= 1 ? [F.cCtrl] : beat === 2 ? [F.cMod] : []}>
      {beat <= 1 && <CodePanel file={F.cCtrl} lines={CCTRL_LINES} focus={seg.focus} />}
      {beat === 0 && <Term er lines={term(String.raw`error TS2551: Property 'findOne' does not exist on type 'CarService'. Did you mean 'findOneBy'?   ← nom boshqacha yozilsa`)} />}
      {(beat === 2 || beat >= 4) && <CodePanel file={F.cMod} lines={CMOD_LINES} focus={beat === 2 ? seg.focus : []} />}
      {beat >= 2 && <CodePanel file={F.appMod + ' · imports'} lines={APPMOD_LINES} />}
      {beat === 3 && <Term lines={CAR_START} />}
      {beat === 3 && <Term title="psql" lines={CARS_TABLE} />}
      {beat >= 4 && <div className="mk-card" style={{ animation: 'mk-up .45s ease both' }}><h5>{t('car resursi — 6 fayl va 2 tahrir', 'ресурс car — 6 файлов и 2 правки')}</h5><div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{t('Yangi fayllar:', 'Новые файлы:')} <code>car.entity.ts</code> · <code>create-car.dto.ts</code> · <code>update-car.dto.ts</code> · <code>car.service.ts</code> · <code>car.controller.ts</code> · <code>car.module.ts</code><br />{t('Tahrir:', 'Правки:')} <code>core/index.ts</code> ({t('export', 'export')}) · <code>app.module.ts</code> (imports: CarModule)</div></div>}
    </Ide>
  </>} />;
}

// ============================================================
//  13 · Haqiqiy so'rovlar
// ============================================================
const REQS13 = [
  { k: 'r1', m: 'POST', u: '/api/v1/car  {"brand":"Chevrolet","model":"Malibu","price":250}', st: 201, body: `{"statusCode":201,"message":"success","data":{"id":"efa80745-74d8-4b56-8ea1-f786f2fff787","created_at":"2026-10-30T21:51:37.138Z","updated_at":"2026-10-30T21:51:37.138Z","brand":"Chevrolet","model":"Malibu","price":250,"is_available":true}}` },
  { k: 'r2', m: 'GET', u: '/api/v1/car', st: 200, body: `{"statusCode":200,"message":"success","data":[{"id":"efa80745-…","brand":"Chevrolet","model":"Malibu","price":250,"is_available":true,…},{"id":"1746997c-…","brand":"Kia","model":"K5","price":320,"is_available":false,…}]}\n(K5 — ikkinchi POST, is_available: false)` },
  { k: 'r3', m: 'PATCH', u: '/api/v1/car/efa80745-…  {"price":240}', st: 200, body: `{"statusCode":200,"message":"success","data":{"id":"efa80745-…","created_at":"2026-10-30T21:51:37.138Z","updated_at":"2026-10-30T21:51:37.228Z","brand":"Chevrolet","model":"Malibu","price":240,"is_available":true}}` },
  { k: 'r4', m: 'DELETE', u: '/api/v1/car/efa80745-…', st: 200, body: `{"statusCode":200,"message":"success","data":{}}\nqayta GET /api/v1/car/efa80745-… → {"statusCode":404,"error":{"message":"not found"}}` },
  { k: 'r5', m: 'POST', u: "/api/v1/car  {} · {…, \"color\":\"oq\"} · {…, \"price\":\"145\"}", st: 400, body: `{}  →  {"statusCode":400,"error":{"message":"brand should not be empty, brand must be a string, model should not be empty, model must be a string, price must be a number conforming to the specified constraints"}}\ncolor  →  {"statusCode":400,"error":{"message":"property color should not exist"}}\n"145"  →  {"statusCode":400,"error":{"message":"price must be a number conforming to the specified constraints"}}` },
  { k: 'r6', m: 'GET', u: '/api/v1/car/1', st: 500, body: `{"statusCode":500,"error":{"message":"Internal server error"}}\nterminal: QueryFailedError: invalid input syntax for type uuid: "1"` },
];
const S13 = {
  kicker: "3-bosqich · so'rovlar", title: "So'rovlar: 201 · 200 · 400 — va /car/1 nega 500", lockHint: "Hamma so'rov tugmasini bosing",
  segments: [
    sg('a', "Resurs tirik: <code>POST</code> → <b>201</b>, <code>id</code> uuid va sanalar o'zi qo'yildi", "Resurs tirik, Swagger'dan so'rov yuboramiz. Mashina qo'shamiz: ikki yuz bir va successRes shaklidagi javob. id uuid, is available true va ikki sana: bularni biz bermadik, ular Base entity'dan va standart qiymatdan.", { open: 'r1' }),
    sg('b', "<code>GET</code> ro'yxat va bittasi, <code>PATCH</code> faqat narx, <code>DELETE</code> — bo'sh <code>data</code>", "GET ro'yxatni va bittasini qaytaradi, ikki yuz. PATCH bilan faqat narxni o'zgartiramiz: ikki yuz, qolgan maydonlar joyida. DELETE: ikki yuz va data bo'sh obyekt. O'chirilgan mashinani qayta so'rasangiz to'rt yuz to'rt.", { open: 'r3' }),
    sg('c', "Qoida buzilsa <b>400</b>: bo'sh so'rov, ortiqcha maydon, qo'shtirnoqdagi raqam", "Endi qoidalarni buzamiz. Bo'sh so'rov: to'rt yuz va hamma buzilgan qoida. Ortiqcha color maydoni: to'rt yuz, property color should not exist. Narx qo'shtirnoq ichida: to'rt yuz, price must be a number. O'quvchi Swagger'dagi misolni o'zgartirganda qo'shtirnoqni ko'p qoldiradi.", { open: 'r5' }),
    sg('d', "<code>/api/v1/car/1</code> → <b>500</b>: id uuid; <code>ParseUUIDPipe</code> qo'shilsa — tushunarli <b>400</b>", "Va o'quvchi odati: cars api'dagidek car slesh bir. Besh yuz. Terminalda sabab: invalid input syntax for type uuid, chunki id raqam emas. Controller'da id parametriga ParseUUIDPipe qo'shilsa, so'rov bazaga yetmaydi: to'rt yuz va tushunarli xabar, Validation failed, uuid is expected.", { open: 'r6', uuid: true }),
    sg('e', "Xulosa: muvaffaqiyat <code>data</code>da, xato <code>error.message</code>da; <b>500 bo'lsa — terminal</b>", "Xulosa: muvaffaqiyat data ichida, xato error message ichida. To'rt yuz bo'lsa xabar DTO qoidasini aytadi, besh yuz bo'lsa sabab terminalda. Endi tugmalarni o'zingiz bosib, har javobni o'qing, keyin Davom ochiladi.", { open: null }),
  ],
};
function Screen13(p) {
  const [open, setOpen] = useState(null);
  const [clicked, setClicked] = useState([]);
  return <Lesson p={p} S={S13} ready={() => clicked.length >= REQS13.length} scene={({ seg }) => {
    const cur = REQS13.find((r) => r.k === (open || seg.open));
    // F-1120-02: tanlangan so'rov rasmda qayerda to'xtaydi — 400 DTO'da, 500 bazada (uuid), ParseUUIDPipe bilan 400 DTO'da
    const pos = !cur ? null : cur.st === 400 || (cur.k === 'r6' && seg.uuid) ? { stop: { k: 'pipe', code: 400 } } : cur.st === 500 ? { stop: { k: 'db', code: 500 } } : { ok: { code: cur.st } };
    return (<>
      <div className="mk-light" style={{ padding: 12 }}><RepoMachine compact url={cur ? `${cur.m} ${cur.u.split(' ')[0].replace(/efa80745-…/, ':id')}` : ''} {...(pos || {})} /></div>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">{t("Swagger'dan so'rov — bosing", 'Запрос из Swagger — нажмите')}</div>
        <div className="mk-req">
          {REQS13.map((r) => <button key={r.k} className={(open || seg.open) === r.k ? 'hl' : ''} onClick={() => { setOpen(r.k); setClicked((c) => c.includes(r.k) ? c : [...c, r.k]); }}><span className={`st s${String(r.st)[0]}`}>{r.st}</span><span>{r.m} {r.u}</span></button>)}
        </div>
        {cur && <pre key={cur.k} style={{ animation: 'mk-up .3s ease both' }}>{cur.body}</pre>}
      </div>
      {seg.uuid && <Ide files={tree(BASE, CAR_ALL)} active={F.cCtrl}>
        <CodePanel file={F.cCtrl + ' · findOne'} lines={ts(String.raw`
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.carService.findOneById(id);
  }`, { 2: { neu: true } })} />
        <Json st={400}>{`GET /api/v1/car/1  →  {"statusCode":400,"error":{"message":"Validation failed (uuid is expected)"}}`}</Json>
      </Ide>}
    </>);
  }} />;
}

// ============================================================
//  14 · Tekshiruv 2 — qaysi satr boshqa qatlamniki (LineCheck; target 0 dan — 13-satr = 12)
// ============================================================
const LC2_LINES = ts(String.raw`
import { Column, Entity } from 'typeorm';
import { IsNumber } from 'class-validator';
import { BaseEntity } from './Base.entity';

@Entity('cars')
export class CarEntity extends BaseEntity {
  @Column()
  brand: string;

  @Column()
  model: string;

  @IsNumber()
  price: number;

  @Column({ default: true })
  is_available: boolean;
}`);
// n — tuzatilgan fayldagi haqiqiy satr raqami: 2-satr (import) o'chgan, keyingilar bittaga yuqoriga, yangi @Column() — 12 (nest-linecheck/TAKLIF.md)
const LC2_FIXED = LC2_LINES.map((l, i) => (i === 1 || i === 12) ? { ...l, gone: true, n: '' } : { ...l, n: i < 1 ? i + 1 : i })
  .flatMap((l, i) => i === 12 ? [l, { neu: true, n: 12, h: `  <span class="d">@Column</span>()   <span class="cm">// ustun — Entity'da; @IsNumber — DTO'da</span>` }] : [l]);
function Screen14(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 2', 'Проверка 2')} eyebrow={t('Tekshiruv · 2 / 5 — qaysi satr xato?', 'Проверка · 2 / 5 — какая строка с ошибкой?')}
    title={t("Bu Entity'da bitta satr boshqa qatlamniki", 'В этой Entity одна строка из другого слоя')}
    task={t("Qoida: Entity jadval shaklini belgilaydi — har ustun <code>@Column</code> bilan. Tekshirish qoidalari (<code>@IsString</code>, <code>@IsNumber</code>…) DTO'da turadi. Bu Entity'da bitta satr DTO'niki. <b>O'sha satrni bosing.</b>", "Правило: Entity задаёт форму таблицы — каждая колонка с <code>@Column</code>. Правила проверки (<code>@IsString</code>, <code>@IsNumber</code>…) живут в DTO. В этой Entity одна строка из DTO. <b>Нажмите на эту строку.</b>")}
    q={t("Besh qatlamni ko'rdingiz, endi o'zingiz tekshiring. Ikkinchi tekshiruv. Qoidani eslang: Entity'da har ustun Column bilan, tekshirish qoidalari esa DTO'da. Ekrandagi Entity'da bitta satr DTO'niki. O'sha satrni bosing.", 'Вы видели пять слоёв, теперь проверьте сами. Вторая проверка. Вспомните правило: в Entity каждая колонка с Column, а правила проверки в DTO. В Entity на экране одна строка из DTO. Нажмите на эту строку.')}
    file={F.cEnt} lines={LC2_LINES} target={12}
    tree={{ root: MKCFG.root, files: tree(BASE, CAR_ALL), active: F.cEnt }}
    fixed={LC2_FIXED.filter((l) => String(l.h).trim() !== '')}
    fixedExtra={[{ file: t('psql · \\d cars — haqiqiy natija', 'psql · \\d cars — реальный результат'), lines: plainLines(t(String.raw`
buzuq holatda:   brand · model · is_available   ← price ustuni YO'Q (synchronize o'chirdi)
POST /api/v1/car {…,"price":250} → 201, javobda va bazada price yo'q
tuzatilgach:     price | integer | not null`, String.raw`
сломано:         brand · model · is_available   ← колонки price НЕТ (synchronize удалил)
POST /api/v1/car {…,"price":250} → 201, в ответе и в базе price нет
исправлено:      price | integer | not null`)) }]}
    ok={t("To'g'ri. O'n uchinchi satr IsNumber, bu tekshirish qoidasi, u DTO'ga tegishli. Bu xato yashirin: sinab ko'rdik: server xatosiz ishga tushadi, lekin synchronize price ustunini bazadan o'chiradi. POST ikki yuz bir qaytaradi, narx esa hech qayerda saqlanmaydi. Ekranda tuzatilgan holat ko'rinib turibdi: Entity'da Column. Demak, ustunni Entity'dagi Column yaratadi, DTO qoidasi esa faqat kirayotgan ma'lumotni tekshiradi.", 'Верно. Тринадцатая строка IsNumber, это правило проверки, оно относится к DTO. Эта ошибка скрытая, мы проверили: сервер запускается без ошибок, но synchronize удаляет колонку price из базы. POST возвращает 201, а цена нигде не сохраняется. На экране виден исправленный вариант: в Entity стоит Column. Значит, колонку создаёт Column в Entity, а правило DTO только проверяет входящие данные.')}
    okShort={t("13-satr: @IsNumber — DTO qoidasi. Sinalgan: server ishga tushadi, price ustuni bazadan o'chadi, POST 201, narx yo'q. Tuzatildi: @Column().", 'Строка 13: @IsNumber — правило DTO. Проверено: сервер запускается, колонка price удаляется из базы, POST 201, цены нет. Исправлено: @Column().')}
    hint={t("Bu satr Entity'ning o'z ishi: import, jadval nomi yoki ustun. Ustun yaratmaydigan, qiymatni tekshiradigan decorator'ni qidiring.", 'Эта строка — работа самой Entity: import, имя таблицы или колонка. Ищите decorator, который не создаёт колонку, а проверяет значение.')} />;
}

// ============================================================
//  15 · Amaliyot 2 — car resursini qo'shing
// ============================================================
const P2 = {
  kicker: 'Amaliyot 2 / 4', eyebrow: "Hozir o'zingizda · 20 daqiqa", title: "car resursini o'z loyihangizga qo'shing", tableAt: 3,
  segments: [
    sg('a', "Endi siz <b>car resursini qo'shasiz</b> — o'quvchining «Ochilish kuni», sinfdan oldin", "Endi navbat sizga: car resursini o'z loyihangizga qo'shasiz. Bu o'quvchi darsining Ochilish kuni, siz uni sinfdan oldin bir marta o'zingiz qilib ko'rasiz. Yigirma daqiqacha. Har qadamda Kodni ochish tugmasi bor: bu namuna, kodni o'zingiz yozing.", { hl: [] }),
    sg('b', "1–3-qadam: Entity va <code>core/index.ts</code>, ikki DTO, Service", "Birinchi: Entity va core index'ga export. Ikkinchi: ikki DTO. Uchinchi: Service, super'ni unutmang.", { hl: [0, 1, 2] }),
    sg('c', "4–5-qadam: Controller, Module va AppModule — terminalda <b>beshta Mapped</b>", "To'rtinchi: Controller, beshta route. Beshinchi: Module va bosh modulga ulash. Terminalda beshta Mapped satrini ko'rsangiz, resurs tirik.", { hl: [3, 4] }),
    sg('d', "6-qadam: Swagger'da POST → <b>201</b>; isbot — javobdagi <code>id</code>ning birinchi 8 belgisi", "Oltinchi: Swagger'da bitta mashina qo'shing, ikki yuz bir. Javobdagi id'ning birinchi sakkiz belgisini isbot maydoniga yozing. Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Katakchalar va isbot bo'lmasa, Davom ochilmaydi. Demak, endi car resursi o'z loyihangizda ishlaydi.", { hl: [5] }),
  ],
};
const P2_STEPS = [
  { t: 'Entity', cmds: [], exp: "src/core/entity/car.entity.ts + src/core/index.ts (export * from './entity/car.entity';)" },
  { t: 'DTO', cmds: [], exp: 'src/api/car/dto/create-car.dto.ts · update-car.dto.ts' },
  { t: 'Service', cmds: [], exp: 'src/api/car/car.service.ts — extends BaseService, super(carRepo)' },
  { t: 'Controller', cmds: [], exp: "src/api/car/car.controller.ts — @Controller('car'), 5 route" },
  { t: 'Module', cmds: [], exp: 'src/api/car/car.module.ts + app.module.ts → imports: [..., CarModule] · terminal: CarController {/api/v1/car} + 5 ta Mapped' },
  { t: 'Swagger', cmds: ['{"brand":"Chevrolet","model":"Malibu","price":250}'], exp: 'POST /api/v1/car → 201 · data.id uuid' },
];
const P2_TROUBLE = [
  ["error TS2305: Module '\"src/core\"' has no exported member 'CarEntity'.", "core/index.ts'ga export yozilmagan (8-ekran)"],
  ["error TS2377: Constructors for derived classes must contain a 'super' call.", "super(carRepo) yo'q (11-ekran)"],
  ["error TS2551: Property 'findOne' does not exist on type 'CarService'. Did you mean 'findOneBy'?", 'metod nomi findOneById (12-ekran)'],
  ["Nest can't resolve dependencies of the CarService (?) … \"CarEntityRepository\"", "car.module.ts'da forFeature yo'q (20-ekranda batafsil)"],
  ['Server ishladi, car uchun Mapped yo\'q, /api/v1/car → 404 Cannot GET /api/v1/car', "AppModule imports'ida CarModule yo'q"],
  ['400 price must be a number…', 'JSON\'da raqam qo\'shtirnoq ichida'],
];
const P2_PROOF = { label: "Isbot: javobdagi data.id'ning birinchi 8 belgisi", placeholder: "id'ning boshidan 8 belgi, defisgacha", check: (v) => /^[0-9a-f]{8}$/i.test(v) && v.toLowerCase() !== 'efa80745', wrong: "8 ta belgi (0–9, a–f), defisgacha — o'z javobingizdagi id'dan (ekrandagi namuna emas)" };
// Explorer tartibida (VS Code: avval papkalar) — Practice fayllarni shu tartibda ko'rsatadi; step — qaysi qadamning «Kodni ochish» tugmasi
const P2_CODE = [
  { step: 1, file: F.cCdto, lines: CDTO_LINES, copy: false },
  { step: 1, file: F.cUdto, lines: UDTO_LINES, copy: false },
  { step: 3, file: F.cCtrl, lines: CCTRL_LINES, copy: false },
  { step: 4, file: F.cMod, lines: CMOD_LINES, copy: false },
  { step: 2, file: F.cSvc, lines: CSVC_LINES, copy: false },
  { step: 0, file: F.cEnt, lines: CAR_ENT_LINES, copy: false },
];
// F-1031-04: «Kodni ochish» oynasida o'quvchi loyihasining to'liq ko'rinishi (VS Code tartibi: avval papkalar, keyin fayllar);
// faqat car fayllari bosiladi, qolgani xira, yopiq papkalar ochilmaydi.
const P2_TREE = ['dist/', 'node_modules/', 'src/api/admin/', 'src/api/auth/', F.cCdto, F.cUdto, F.cCtrl, F.cMod, F.cSvc, F.appMod, F.appSvc,
  'src/common/', 'src/config/', F.aEnt, F.baseEnt, F.cEnt, 'src/core/repository/', F.coreIdx, 'src/infrastructure/', F.main, 'test/', F.env, F.envEx, 'package.json'];
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} code={P2_CODE} tree={P2_TREE} />; }
