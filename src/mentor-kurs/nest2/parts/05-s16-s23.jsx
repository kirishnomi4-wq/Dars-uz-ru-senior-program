
// ============================================================
//  4-BOSQICH · Guard va token (16–19)
// ============================================================
const AUTHG_LINES = ts(String.raw`
canActivate(ctx: ExecutionContext): boolean {
  //  Agar route @Roles('public') bo'lsa — token talab qilinmaydi
  const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [ctx.getHandler(), ctx.getClass()]);
  if (roles?.includes('public')) return true;

  const req = ctx.switchToHttp().getRequest();
  const auth = req.headers.authorization as string | undefined;
  if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException();

  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, config.Token.access_token_key);
    req.user = payload;
    return true;
  } catch {
    throw new UnauthorizedException();
  }
}`, { 2: { id: 'pub' }, 3: { id: 'pub' }, 4: { id: 'pub' }, 6: { id: 'hdr' }, 7: { id: 'hdr' }, 8: { id: 'hdr' }, 10: { id: 'jwt' }, 12: { id: 'jwt' }, 13: { id: 'jwt' }, 16: { id: 'jwt' } });
// So'rov yo'li sxemasi (Explorer'siz — M19 istisno): nuqta Guard'da to'xtaydi
function GuardFlow({ stop, label }) {
  const box = (k, c, h, d) => <div className={`mk-box${stop === k ? ' hl' : ''}`} style={{ '--c': c }}><h4>{h}</h4><p>{d}</p></div>;
  // flex: 0 0 auto — tor ekranda (1280×720) panel siqilmaydi, qatori kesilmaydi; VS Code oynasi o'zi ichida aylanadi
  return <div className="mk-light" style={{ padding: 16, flex: '0 0 auto', maxHeight: 'none' }}>
    <div className="mk-tag">{t("So'rov yo'li — Controller'dan oldin ikki qo'riqchi", 'Путь запроса — два охранника перед Controller')}</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 28px 1fr 28px 1fr 28px 1fr', alignItems: 'stretch' }}>
      {box('br', T.ink2, t('Brauzer', 'Браузер'), 'GET /api/v1/admin')}<div className="mk-arrow on">→</div>
      {box('auth', N2.guard, 'AuthGuard', t('token bormi?', 'есть токен?'))}<div className={`mk-arrow${stop === 'auth' ? '' : ' on'}`}>→</div>
      {box('roles', N2.guard, 'RolesGuard', t('rol ro\'yxatdami?', 'роль в списке?'))}<div className={`mk-arrow${stop ? '' : ' on'}`}>→</div>
      {box('ctrl', PART.ctrl, 'Controller', t('ishlaydi', 'работает'))}
    </div>
    {label && <div className="mk-rule" style={{ marginTop: 12 }}>{label}</div>}
  </div>;
}
const S16 = {
  kicker: '4-bosqich · Guard', title: "AuthGuard: token bormi — yo'q bo'lsa 401",
  segments: [
    sg('a', "Car route'lari ochiq edi; admin route'lari <b>himoyalangan</b> — Controller'dan oldin <b>Guard</b> turadi", "Car route'larimiz tokensiz ochiq. Admin route'lari esa himoyalangan: tokensiz to'rt yuz bir. Buni Controller emas, undan oldin turgan Guard qiladi, qo'riqchi. Admin Controller ustida ikkita Guard ulangan: Auth guard va Roles guard. Birinchisidan boshlaymiz.", { focus: [], stop: 'auth' }),
    sg('b', "Nega <code>'public'</code>? Token <b>signin'da beriladi</b> — signin ham token so'rasa, hech kim kira olmasdi", "Auth guard avval route'dagi Roles belgisiga qaraydi: public bo'lsa, tekshirmasdan o'tkazadi. Nega signin'ga public qo'yilgan? Token aynan signin'da beriladi, kirishdan oldin hech kimda token yo'q. Signin ham token so'rasa, hech kim kira olmasdi. Shuning uchun bu to'g'ri qaror, xavfsizlik teshigi emas: kirish eshigi ochiq, qolgan eshiklar yopiq.", { focus: ['pub'], pub: true }),
    sg('c', "Aks holda <code>Authorization: Bearer</code> va yaroqli token kerak — bo'lmasa <b>401</b>", "Qolgan route'larda so'rovda Authorization header'i bo'lishi kerak: Bearer so'zi va token. Header yo'q, token soxta yoki muddati o'tgan bo'lsa, to'rt yuz bir, Unauthorized. Token yaroqli bo'lsa, ichidagi id va rol so'rovga yoziladi, keyingi Guard shuni o'qiydi.", { focus: ['hdr', 'jwt'] }),
    sg('d', "Token signin'da beriladi va <b>24 soat</b> yashaydi; eskirsa — <b>qayta signin</b>", "Token signin'da beriladi va env'dagi sozlamaga ko'ra yigirma to'rt soat yashaydi. Muddati o'tsa nima qilinadi? Sinab ko'rdik: loyihadagi token yangilash route'i ham yaroqli token so'raydi, eskirgan token bilan to'rt yuz bir beradi. Demak yagona yo'l: qayta signin.", { focus: [], expiry: true }),
    sg('e', "Xulosa: 401 — <b>«kim ekaningiz noma'lum»</b>: signin qiling va tokenni Authorize'ga qo'ying", "Xulosa: to'rt yuz bir, kim ekaningiz noma'lum degani. Yechim kodda emas: signin qiling va tokenni Swagger'dagi Authorize oynasiga qo'ying. Endi ikkinchi qo'riqchi: token bor, lekin bu eshik sizga ochiqmi?", { focus: [] }),
  ],
};
const EXPIRY = plainLines(String.raw`
# Access_Token_Time=5s bilan sinov (haqiqiy)
POST /api/v1/admin/signin            → 201 · data.token = eyJ…
GET  /api/v1/admin/all/admin  (token) → 200
… 6 soniya …
GET  /api/v1/admin/all/admin  (token) → 401 Unauthorized
POST /api/v1/admin/token  (cookie + eskirgan token) → 401
POST /api/v1/admin/token  (cookie + yangi signin tokeni) → 201`, { 5: { id: 'x' }, 6: { id: 'x' } });
// F-1031-06: signin nega 'public' — haqiqiy repo, admin.controller.ts 46–53
const SIGNIN_PUB = ts(String.raw`
@Roles('public')
@Post('signin')
signin(
  @Body() signInDto: SignInDto,
  @Res({ passthrough: true }) res: Response,
) {
  return this.adminService.signIn(signInDto, res);
}`, { 1: { id: 'p' } });
function Screen16(p) {
  return <Lesson p={p} S={S16} scene={({ seg, beat }) => <>
    <GuardFlow stop="auth" label={beat >= 4 ? <><b>401</b> = {t('AuthGuard: token yo\'q yoki yaroqsiz → signin → Authorize', 'AuthGuard: токена нет или он недействителен → signin → Authorize')}</> : null} />
    <Ide files={tree(BASE, [F.aCtrl, F.authG, F.rolesG])} active={F.authG}>
      <CodePanel file={F.authG} lines={AUTHG_LINES} focus={seg.focus} />
      {beat === 0 && <CodePanel file={F.aCtrl + ' · 31–33'} lines={ts(String.raw`
@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {`)} />}
      {seg.pub && <CodePanel file={F.aCtrl + ' · 46–53'} lines={SIGNIN_PUB} focus={['p']} />}
      {seg.pub && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>{t(<><b>'public'</b> — to'g'ri qaror: tokenni shu eshikdan olasiz. Qolgan eshiklar yopiq.</>, <><b>'public'</b> — правильное решение: токен вы получаете через эту дверь. Остальные двери закрыты.</>)}</div>}
      {seg.expiry && <Term lines={EXPIRY} focus={['x']} />}
    </Ide>
  </>} />;
}

// ============================================================
//  17 · RolesGuard: 403, superadmin va admin — har xil rol
// ============================================================
const ROLESG_LINES = ts(String.raw`
// roles-decorator.ts
export const Roles = (...roles: (UserRole | string)[]) => SetMetadata(ROLES_KEY, roles);

// roles.guard.ts
if (!roles || roles.includes('public') || roles.length === 0) {
  return true;
}
if (
  (req.user?.role && roles.includes(req.user.role)) ||
  (roles.includes('ID') && req.user?.id === req.params.id)
) {
  return true;
}
return false;`, { 2: { id: 'dec' }, 5: { id: 'p1' }, 6: { id: 'p1' }, 9: { id: 'p2' }, 10: { id: 'p3' }, 12: { id: 'p2' }, 14: { id: 'no' } });
const ROLE_ROWS = [
  ["@Roles('admin') POST", '401', '403 Forbidden resource', '201', 'r1'],
  ["@Roles('public') GET", '200', '200', '200', 'r2'],
  ['@Roles yozilmagan PATCH', '401', '200', '200', 'r3'],
  ['@Roles(UserRole.ADMIN) DELETE', '—', '403', '200', 'r4'],
];
const S17 = {
  kicker: '4-bosqich · Guard', title: "RolesGuard: token bor, lekin bu eshik sizga ochiqmi — yo'q bo'lsa 403",
  segments: [
    sg('a', "<code>@Roles(...)</code> — route ustidagi <b>rollar ro'yxati</b>; Guard uni tokendagi rol bilan solishtiradi", "Ikkinchi qo'riqchi Roles guard. Har route ustida Roles decorator'i bilan rollar ro'yxati yoziladi. Guard shu ro'yxatni tokendagi rol bilan solishtiradi. Rol signin'da bazadan olinadi, mijoz uni o'zi o'zgartira olmaydi.", { focus: ['dec'], row: null }),
    sg('b', "O'tadi: ro'yxat yo'q yoki <code>'public'</code> · rol ro'yxatda · <code>'ID'</code> va o'z yozuvi; <b>qolgani 403</b>", "Guard uch holatda o'tkazadi: ro'yxat yo'q yoki public bo'lsa; tokendagi rol ro'yxatda bo'lsa; ro'yxatda ID so'zi bo'lsa va foydalanuvchi o'z yozuvini so'rasa. Qolgan hamma holat to'rt yuz uch, Forbidden resource.", { focus: ['p1', 'p2', 'p3', 'no'], row: null }),
    sg('c', "Muhim: <b><code>superAdmin</code> va <code>admin</code> — har xil rol</b>: <code>@Roles('admin')</code> eshigiga superadmin ham <b>403</b> oladi", "Endi eng muhim gap, sinfda albatta chiqadi. Loyihada ikki rol bor, superadmin va admin, ular har xil so'z. Ro'yxatda faqat admin yozilgan eshikka superadmin kirsa ham to'rt yuz uch oladi. Sinab ko'rdik: superadmin tokeni bilan to'rt yuz uch, oddiy admin tokeni bilan ikki yuz bir.", { focus: ['p2'], row: 'r1' }),
    sg('d', "<code>@Roles</code> yozilmagan eshik — <b>«tizimga kirganlar uchun»</b>: token kerak, rol tekshirilmaydi", "Va yana bir holat: Roles umuman yozilmagan eshik. Auth guard token so'raydi, tokensiz to'rt yuz bir. Roles guard'da ro'yxat yo'q, u o'tkazadi. Demak bu eshik tizimga kirgan har kim uchun ochiq.", { focus: ['p1'], row: 'r3' }),
    sg('e', "Xulosa: 401 — token yo'q; 403 — <b>rol ro'yxatda yo'q</b>: ro'yxat va kirgan rolni yonma-yon qo'ying", "Xulosa: to'rt yuz bir, token yo'q yoki yaroqsiz; to'rt yuz uch, token bor, lekin rol ro'yxatda yo'q. O'quvchi to'rt yuz uch desa, ikki narsani yonma-yon qo'ying: route ustidagi Roles ro'yxati va u qaysi rol bilan kirgani.", { focus: [], row: 'all' }),
  ],
};
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg, beat }) => <>
    <Ide files={tree(BASE, [F.aCtrl, F.authG, F.rolesG, F.rolesD])} active={F.rolesG}>
      <CodePanel file="roles-decorator.ts · roles.guard.ts" lines={ROLESG_LINES} focus={seg.focus} />
    </Ide>
    <Block at={2} beat={beat}><div className="mk-light" style={{ padding: 12 }}>
      <div className="mk-tag">{t('Haqiqiy javoblar — KitobShop playbook qoidalari bilan sinov', 'Реальные ответы — проверка с правилами playbook KitobShop')}</div>
      <table className="mk-tbl n2-table"><thead><tr><th>{t('eshik', 'дверь')}</th><th>{t('tokensiz', 'без токена')}</th><th>superadmin (superAdmin)</th><th>{t('oddiy admin (admin)', 'обычный админ (admin)')}</th></tr></thead><tbody>
        {ROLE_ROWS.map((r) => <tr key={r[4]} className={seg.row === r[4] || seg.row === 'all' ? 'hl' : ''}><td><code>{r[0]}</code></td><td>{r[1]}</td><td><b style={{ color: /403/.test(r[2]) ? T.accent : T.ink }}>{r[2]}</b></td><td>{r[3]}</td></tr>)}
      </tbody></table>
    </div></Block>
    <Block at={4} beat={beat}><div className="mk-rule"><b>401</b> = AuthGuard ({t('token', 'токен')}) · <b>403</b> = RolesGuard ({t('rol', 'роль')}) · <code>'public'</code> = {t('hamma', 'все')} · <code>@Roles</code> {t("yo'q = tizimga kirganlar", 'нет = вошедшие в систему')} · <code>'ID'</code> = {t("o'z yozuvi", 'своя запись')} · <b>{t('superAdmin va admin — har xil rol', 'superAdmin и admin — разные роли')}</b></div></Block>
  </>} />;
}

// ============================================================
//  18 · Tekshiruv 3 — superadmin bilan 403
// ============================================================
function Screen18(p) {
  const above = <div style={{ marginBottom: 12 }}><Ide files={tree(BASE, [F.bCtrl, F.bMod, F.bSvc])} active={F.bCtrl}>
    <CodePanel file={F.bCtrl} lines={ts(String.raw`
@UseGuards(AuthGuard, RolesGuard)
@Controller('book')
export class BookController {
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateBookDto) { … }`, { 4: { id: 'r' } })} focus={['r']} />
    <Json st={403}>{t(`superadmin tokeni bilan POST /api/v1/book  →  {"statusCode":403,"error":{"message":"Forbidden resource"}}`, `с токеном superadmin POST /api/v1/book  →  {"statusCode":403,"error":{"message":"Forbidden resource"}}`)}</Json>
  </Ide></div>;
  const after = <Json st={201}>{t(`ali (role: admin) tokeni bilan POST /api/v1/book  →  {"statusCode":201,"message":"success","data":{…"title":"Test kitob"…}}`, `с токеном ali (role: admin) POST /api/v1/book  →  {"statusCode":201,"message":"success","data":{…"title":"Test kitob"…}}`)}</Json>;
  return <MCRetry {...p} kicker={t('Tekshiruv 3', 'Проверка 3')} eyebrow={t('Tekshiruv · 3 / 4', 'Проверка · 3 / 4')} above={above} after={after}
    title={t("O'quvchi: «KitobShop'da superadmin tokeni bilan kitob qo'shdim — 403». Sabab?", 'Ученик: «В KitobShop добавил книгу с токеном суперадмина — 403». Причина?')}
    q={t("Ikkala qo'riqchini bilasiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi KitobShop'da superadmin tokeni bilan kitob qo'shmoqchi, javob to'rt yuz uch. Ekranda route kodi va javob. Sabab nima? Variantni tanlang.", 'Вы знаете обоих охранников, давайте проверим. Третья проверка. Ученик в KitobShop хочет добавить книгу с токеном superadmin, ответ 403. На экране код route и ответ. В чём причина? Выберите вариант.')}
    opts={t(["Token muddati o'tgan, qayta signin kerak", "Authorize bosilmagan, so'rovda token yo'q", "Ro'yxatda faqat admin, superadminning roli boshqa", "BookModule AppModule'ga ulanmagan"], ['Срок токена истёк, нужен новый signin', 'Authorize не нажата, в запросе нет токена', 'В списке только admin, у superadmin другая роль', 'BookModule не подключён к AppModule'])} correct={2}
    ok={t("To'g'ri. Ro'yxatda faqat admin bor, superadminning roli esa superAdmin, bu boshqa so'z. Token yaroqli, shuning uchun to'rt yuz bir emas, to'rt yuz uch chiqadi. Yechim shunday: superadmin bilan oddiy admin yarating va KitobShop'ni o'sha admin bilan sinang. Ekranda natija: oddiy admin tokeni bilan ikki yuz bir. Demak, to'rt yuz uch token emas, rol yetmasligini bildiradi.", 'Верно. В списке только admin, а роль superadmin — superAdmin, это другое слово. Токен действующий, поэтому не 401, а 403. Решение такое: создайте через superadmin обычного админа и проверяйте KitobShop под ним. На экране результат: с токеном обычного админа 201. Значит, 403 говорит не о токене, а о том, что не хватает роли.')}
    okShort={t('superAdmin va admin — har xil rol. Token yaroqli → 403 (401 emas). Oddiy admin bilan → 201.', 'superAdmin и admin — разные роли. Токен действующий → 403 (не 401). С обычным админом → 201.')}
    wrong={t({ 0: "Token eskirgan bo'lsa Auth guard 401 berardi, 403 emas.", 1: "Token yo'q bo'lsa ham 401. 403 — token bor, rol ro'yxatda yo'q.", 3: "Modul ulanmagan bo'lsa route topilmaydi: 404." }, { 0: 'Если бы токен истёк, Auth guard дал бы 401, а не 403.', 1: 'Без токена тоже 401. 403 — токен есть, роли нет в списке.', 3: 'Если модуль не подключён, route не найден: 404.' })} />;
}

// ============================================================
//  19 · Amaliyot 3 — signin, Authorize, oddiy admin
// ============================================================
const P3 = {
  kicker: 'Amaliyot 3 / 4', eyebrow: "Hozir o'zingizda · 10 daqiqa", title: "Superadmin bilan kiring, oddiy admin yarating va farqni ko'ring", tableAt: 3,
  segments: [
    sg('a', "Endi siz: <b>signin, Authorize va oddiy admin</b> — KitobShop darsidan oldingi tayyorgarlik", "Endi navbat sizga. Bu amaliyot KitobShop darsidan oldin har o'quvchi qiladigan tayyorgarlik: superadmin bilan kirish, oddiy admin yaratish va farqni ko'rish. To'rt qadam, o'n daqiqacha.", { hl: [] }),
    sg('b', "1–2-qadam: superadmin bilan <b>signin</b> qiling, tokenni <b>Authorize</b>'ga qo'ying — adminlar ro'yxati 200 bilan ochiladi", "Birinchi: Swagger'da signin, env'dagi superadmin nomi va paroli bilan. Javobdagi tokenni qo'shtirnoqsiz nusxalang. Ikkinchi: tokenni Authorize oynasiga qo'ying va adminlar ro'yxatini so'rang: ikki yuz.", { hl: [0, 1] }),
    sg('c', "3-qadam: <code>POST admin</code> bilan <b>oddiy admin</b> yarating; isbot — uning <code>id</code>sidan 8 belgi", "Uchinchi: POST admin bilan oddiy admin yarating, paroli kuchli bo'lsin. Javob ikki yuz bir, yangi adminning roli admin. Uning id'sidan birinchi sakkiz belgini isbot maydoniga yozing.", { hl: [2] }),
    sg('d', "4-qadam: yangi admin bilan kiring va <code>POST admin</code> qiling — <b>403</b> chiqishi kerak", "To'rtinchi: Authorize'dan chiqing, yangi admin bilan kiring va yana POST admin qiling: to'rt yuz uch, chunki admin yaratish faqat superadmin uchun. Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Katakchalar va isbot bo'lmasa, Davom ochilmaydi. Demak, siz admin va superadmin rollari farqini o'z loyihangizda ko'rdingiz.", { hl: [3] }),
  ],
};
const P3_STEPS = [
  { t: 'Signin', cmds: ['{"username":"superadmin","password":"Superadmin1!"}'], exp: 'POST /api/v1/admin/signin → HTTP 201 · body {"statusCode":200,"message":"success","data":{"token":"eyJ…"}}' },
  { t: 'Authorize', cmds: [], exp: "token → «Authorize» → GET /api/v1/admin/all/admin → 200 · data[0].role = superAdmin" },
  { t: 'Oddiy admin', cmds: ['{"username":"ali","phone_number":"+998901112233","full_name":"Ali Valiyev","password":"Developer1!"}'], exp: 'POST /api/v1/admin → 201 · "role":"admin"' },
  { t: 'Farq', cmds: ['{"username":"ali","password":"Developer1!"}'], exp: 'Logout → ali bilan signin → Authorize → POST /api/v1/admin → 403 {"statusCode":403,"error":{"message":"Forbidden resource"}}' },
];
const P3_TROUBLE = [
  ['signin → 400 password is not strong enough', ".env'dagi PASSWORD'ni aynan yozing — yozilgan parol kuchsiz"],
  ['signin → 401 Admin not fount', "username .env'dagi bilan bir xil emas (imlo repodan); yoki superadmin bo'sh yaratilgan — 6-ekrandagi yechim"],
  ['signin → 400 username or password incorect', "parol kuchli, lekin noto'g'ri (imlo repodan)"],
  ['401 Unauthorized', "Authorize bosilmagan yoki token qo'shtirnoq bilan qo'yilgan"],
  ['POST admin → 400 Phone Number already exists / Username already exists', 'shu telefon yoki nom band — boshqasini yozing'],
];
const P3_PROOF = { label: "Isbot: yangi admin id'sining birinchi 8 belgisi", placeholder: "id'ning boshidan 8 belgi", check: (v) => /^[0-9a-f]{8}$/i.test(v) && v.toLowerCase() !== 'd4264287', wrong: "8 ta belgi (0–9, a–f), defisgacha — POST admin javobidagi data.id'dan" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }

// ============================================================
//  5-BOSQICH · Buzamiz (20–23)
// ============================================================
const FF_BROKEN = ts(String.raw`
@Module({
  imports: [TypeOrmModule.forFeature([CarEntity])],
  imports: [],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}`, { 2: { gone: true }, 3: { neu: true } });
const FF_FIXED = ts(String.raw`
@Module({
  imports: [],
  imports: [TypeOrmModule.forFeature([CarEntity])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}`, { 2: { gone: true }, 3: { neu: true } });
const FF_ERR = term(String.raw`
[Nest] ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the CarService (?).
Please make sure that the argument "CarEntityRepository" at index [0] is available in the CarModule module.

Potential solutions:
- Is CarModule a valid NestJS module?
- If "CarEntityRepository" is a provider, is it part of the current CarModule?
- If "CarEntityRepository" is exported from a separate @Module, is that module imported within CarModule?`, { 1: { id: 'who' }, 2: { id: 'what' }, 4: { id: 'sol' }, 5: { id: 'sol' }, 6: { id: 'sol' }, 7: { id: 'sol' } });
const S20 = {
  kicker: '5-bosqich · buzamiz 1', title: "forFeature o'chirildi — xabarni uch savol bilan o'qiymiz",
  segments: [
    sg('a', "Ataylab buzamiz: <code>car.module.ts</code>dan <b><code>forFeature</code> olib tashlandi</b> — server yiqildi", "Resurs ishlaydi, himoyani bilasiz. Endi ataylab buzamiz, chunki o'quvchi va uning agenti aynan shu xatolarni qiladi. Car module'dan forFeature satrini olib tashladik. Server yiqildi, xabarni Nest birinchi darsidagi uch savol bilan o'qiymiz.", { focus: [] }),
    sg('b', "Qaysi klass — <b><code>CarService (?)</code></b>: bu safar Service'ning dependency'si topilmadi", "Qaysi klass: Car service. Nest birinchi darsida bu yerda Controller edi, bu safar Service. Qavsdagi so'roq belgisi topilmagan dependency o'rni.", { focus: ['who'] }),
    sg('c', "Qaysi dependency — <b><code>CarEntityRepository</code></b>; qaysi fayl — <b><code>CarModule</code></b>, ya'ni <code>car.module.ts</code>", "Qaysi dependency: Car entity Repository, konstruktordagi birinchi parametr. Qaysi fayl: Car module, ya'ni car module ts. Repository so'zini ko'rdingizmi, demak javob providers'da emas, imports'da: Repository'ni forFeature beradi.", { focus: ['what', 'sol'] }),
    sg('d', "Tuzatamiz: <code>forFeature</code> qaytdi — <b>beshta Mapped</b> va successfully started", "Tuzatamiz: forFeature satrini qaytaramiz va saqlaymiz. Terminal: Car module tayyor, Car controller, beshta Mapped va successfully started.", { focus: [], fixed: true }),
    sg('e', "Xulosa: xabarda <b><code>…Repository</code></b> bo'lsa — modul faylining <code>imports</code>ida <code>forFeature</code> bormi", "Xulosa: can't resolve dependencies xabarida Repository so'zi bo'lsa, modul faylini oching va imports'da shu Entity bilan forFeature bor-yo'qligini tekshiring. Formula o'zgarmaydi: qaysi klass, qaysi dependency, qaysi fayl.", { focus: [], fixed: true }),
  ],
};
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg, beat }) => <Ide files={tree(BASE, CAR_ALL)} active={F.cMod}>
    <CodePanel key={seg.fixed ? 'f' : 'b'} file={F.cMod} lines={seg.fixed ? FF_FIXED : FF_BROKEN} />
    {seg.fixed ? <Term title={t('terminal — tuzatildi', 'terminal — исправлено')} lines={CAR_START} /> : <Term er title={t('terminal — server yiqildi', 'terminal — сервер упал')} lines={FF_ERR} focus={seg.focus} />}
    <Block at={4} beat={beat}><div className="mk-rule">{t(<>Xabarda <code>…Service (?)</code> va <code>…EntityRepository</code> bo'lsa — o'sha resursning <code>module.ts</code> faylida <code>imports: [TypeOrmModule.forFeature([…Entity])]</code> bormi, tekshiring.</>, <>Если в сообщении <code>…Service (?)</code> и <code>…EntityRepository</code> — проверьте, есть ли в <code>module.ts</code> этого ресурса <code>imports: [TypeOrmModule.forFeature([…Entity])]</code>.</>)}</div></Block>
  </Ide>} />;
}

// ============================================================
//  21 · Buzamiz 2: Entity o'zgardi — baza o'zgardi
// ============================================================
const S21 = {
  kicker: '5-bosqich · buzamiz 2', title: "Entity o'zgarsa, baza o'zi o'zgaradi — xato bermay yoki yiqilib",
  segments: [
    sg('a', "<code>synchronize</code> har ishga tushishda bazani <b>Entity'ga moslaydi</b> — qulay ham, xavfli ham", "Ikkinchi holat bazada ko'rinadi. Dev rejimida synchronize yoqilgan: server har ishga tushganda bazani Entity'ga moslaydi. Jadval o'zi yaratilgani qulay edi. Lekin Entity o'zgarsa, baza ham so'ramasdan o'zgaradi.", { v: 'sync' }),
    sg('b', "Ustundan <code>@Column</code> olib tashlansa — ustun bazadan <b>o'chadi</b>: server xatosiz, narx yo'q", "Ikkinchi tekshiruvdagi holatni haqiqatda yurgizdik: price'dan Column olib tashlandi. Server xatosiz ishga tushdi, synchronize price ustunini bazadan o'chirdi. POST ikki yuz bir qaytaradi, lekin narx na javobda, na bazada. Hech qanday xabar chiqmaydi.", { v: 'drop' }),
    sg('c', "Bor jadvalga majburiy ustun qo'shilsa — server <b>yiqiladi</b>: <code>contains null values</code>", "Teskari holat: jadvalda mashinalar bor, Entity'ga esa majburiy yangi ustun qo'shildi, masalan brand'ga bog'lash uchun brandId. Server ishga tushmaydi: column brandId contains null values. Eski satrlarda bu ustun bo'sh, majburiy ustun esa bo'sh bo'la olmaydi.", { v: 'add' }),
    sg('d', "Yechim: yangi ustun <b><code>nullable: true</code></b> — server ishga tushadi, eski ma'lumot joyida", "Yechim: yangi ustunni ixtiyoriy qilish, nullable true. Sinab ko'rdik: shunday qilinsa server ishga tushdi, ustun va tashqi kalit yaratildi, eski mashinalar joyida qoldi.", { v: 'fix' }),
    sg('e', "Xulosa: Entity'ni o'zgartirish — <b>bazani o'zgartirish</b>; «ma'lumot yo'qoldi» desa — Entity'ni so'rang", "Xulosa: Entity'ni o'zgartirish bazani o'zgartirish demak. Ustun olib tashlansa, ma'lumot xato bermay o'chadi; majburiy ustun qo'shilsa, server yiqiladi. O'quvchi ma'lumotlarim yo'qoldi yoki contains null values desa, birinchi savol: Entity'da nimani o'zgartirdingiz?", { v: 'sum' }),
  ],
};
const ENT_DROP = ts(String.raw`
  @Column()
  model: string;

  @IsNumber()        // @Column o'rniga
  price: number;`, { 4: { id: 'x' } });
const ENT_ADD = ts(String.raw`
  @ManyToOne(() => BrandEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brandId' })
  brand_rel: BrandEntity;

  @Column()
  brandId: string;`, { 5: { id: 'x' } });
const ENT_FIX = ts(String.raw`
  @ManyToOne(() => BrandEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brandId' })
  brand_rel: BrandEntity;

  @Column()
  @Column({ nullable: true })
  brandId: string;`, { 5: { gone: true }, 6: { neu: true } });
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => {
    const v = seg.v;
    return <div style={{ display: 'grid', gap: 10 }}>
      <Ide files={tree(BASE, CAR_ALL)} active={F.cEnt}>
        {v === 'sync' || v === 'sum' ? <CodePanel file={F.cEnt} lines={CAR_ENT_LINES} /> : <CodePanel file={F.cEnt + ' · ' + t("o'zgargan joy", 'изменённое место')} lines={v === 'drop' ? ENT_DROP : v === 'add' ? ENT_ADD : ENT_FIX} focus={v === 'fix' ? [] : ['x']} />}
      </Ide>
      <div style={{ display: 'grid', gap: 10, minWidth: 0 }}>
        {(v === 'sync' || v === 'sum') && <div className="mk-light"><div className="mk-tag">synchronize: true (NODE_ENV=dev)</div><div style={{ fontSize: 14 }}>{t("Har ishga tushishda: Entity → baza. Ustun qo'shilsa — qo'shiladi, olib tashlansa — o'chiriladi.", 'При каждом запуске: Entity → база. Колонку добавили — добавится, убрали — удалится.')}</div></div>}
        {v === 'drop' && <><Term title="psql · \d cars" lines={plainLines(String.raw`
 brand        | character varying | not null
 model        | character varying | not null
                                   ← price ustuni YO'Q`.replace("← price ustuni YO'Q", t("← price ustuni YO'Q", '← колонки price НЕТ')))} /><Json st={201}>{`POST /api/v1/car {"brand":"Chevrolet","model":"Malibu","price":250}\n→ {"statusCode":201,"message":"success","data":{…"brand":"Chevrolet","model":"Malibu","is_available":true}}   ← price yo'q`.replace("← price yo'q", t("← price yo'q", '← price нет'))}</Json></>}
        {v === 'add' && <Term er lines={term(String.raw`QueryFailedError: column "brandId" of relation "cars" contains null values`)} />}
        {v === 'fix' && <Term title="psql · \d cars" lines={term(String.raw`
 brandId      | uuid |   (nullable)
 FOREIGN KEY ("brandId") REFERENCES brands(id) ON DELETE CASCADE
 Nest application successfully started`)} />}
        {v === 'sum' && <div className="mk-rule">{t(<><b>Ma'lumot yo'qoldi</b> yoki <b>contains null values</b> bo'lsa, «Entity'da nimani o'zgartirdingiz?» deb so'rang; yangi ustunga <code>nullable: true</code> qo'ying.</>, <><b>Данные пропали</b> или <b>contains null values</b> — спросите «Что вы изменили в Entity?»; новой колонке поставьте <code>nullable: true</code>.</>)}</div>}
      </div>
    </div>;
  }} />;
}

// ============================================================
//  22 · Tekshiruv 4 — o'quvchi KitobShop'idagi xato
// ============================================================
const BOOK_ERR = term(String.raw`
Nest can't resolve dependencies of the BookService (?).
Please make sure that the argument "BookEntityRepository" at index [0] is available in the BookModule module.`);
const BOOK_START = term(String.raw`
[Nest] LOG [InstanceLoader] BookModule dependencies initialized
[Nest] LOG [RoutesResolver] BookController {/api/v1/book}:
[Nest] LOG [RouterExplorer] Mapped {/api/v1/book, POST} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/book, GET} route`);
function Screen22(p) {
  const above = <div style={{ marginBottom: 12, display: 'grid', gap: 6 }}><Term er lines={BOOK_ERR} /><div className="exp" style={{ fontSize: 12.5, color: T.ink3 }}>{t('Xabar shakli haqiqiy (20-ekran), nomlar KitobShop\'ga almashtirilgan.', 'Форма сообщения реальная (экран 20), имена заменены на KitobShop.')}</div></div>;
  const after = <Ide files={tree(BASE, [F.bMod, F.bCtrl, F.bSvc, F.bEnt])} active={F.bMod}>
    <CodePanel file={F.bMod} lines={ts(String.raw`
@Module({
  imports: [],
  imports: [TypeOrmModule.forFeature([BookEntity])],
  controllers: [BookController],
  providers: [BookService],
})`, { 2: { gone: true }, 3: { neu: true } })} />
    <Term lines={BOOK_START} />
  </Ide>;
  return <MCRetry {...p} kicker={t('Tekshiruv 4', 'Проверка 4')} eyebrow={t("Tekshiruv · 4 / 4 — xatoni o'qish", 'Проверка · 4 / 4 — чтение ошибки')} above={above} after={after}
    title={t("O'quvchingizning KitobShop'i yiqildi. Qaysi faylni ochasiz va nimani tuzatasiz?", 'KitobShop вашего ученика упал. Какой файл откроете и что исправите?')}
    q={t("Oxirgi tekshiruv, sinfdagi haqiqiy holat. To'rtinchi tekshiruv. O'quvchi agent yozgan kitob resursini ishga tushirdi, server yiqildi, ekranda xabar. U yordam so'radi. Qaysi faylni ochasiz va nimani tuzatasiz?", 'Последняя проверка, реальный случай из класса. Четвёртая проверка. Ученик запустил ресурс книг, написанный агентом, сервер упал, на экране сообщение. Он просит помощи. Какой файл вы откроете и что исправите?')}
    opts={t(["book.module.ts — imports'ga TypeOrmModule.forFeature([BookEntity])", "app.module.ts — providers'ga BookService", "book.service.ts — konstruktordan Repository'ni olib tashlash", "book.entity.ts — @Injectable() qo'shish"], ["book.module.ts — в imports TypeOrmModule.forFeature([BookEntity])", "app.module.ts — в providers BookService", 'book.service.ts — убрать Repository из конструктора', 'book.entity.ts — добавить @Injectable()'])} correct={0}
    ok={t("To'g'ri: book module faylida imports ro'yxatiga Book entity bilan forFeature qo'shiladi. Xabar uch narsani aytadi: klass Book service, dependency Book entity Repository, fayl Book module. Ekranda tuzatilgan fayl va terminaldagi Book controller va Mapped satrlari ko'rinib turibdi. Demak, dependency nomida Repository so'zi bo'lsa, javob modulning forFeature ro'yxatida.", 'Верно: в файле book module в список imports добавляется forFeature с Book entity. Сообщение называет три вещи: класс Book service, dependency Book entity Repository, файл Book module. На экране виден исправленный файл и в терминале Book controller и строки Mapped. Значит, если в имени dependency есть слово Repository, ответ — в списке forFeature модуля.')}
    okShort={t('Klass BookService · dependency BookEntityRepository · fayl book.module.ts → forFeature([BookEntity]).', 'Класс BookService · dependency BookEntityRepository · файл book.module.ts → forFeature([BookEntity]).')}
    wrong={t({ 1: "Service bosh modulning providers'iga yozilmaydi; xabar BookModule haqida.", 2: "Repository'siz Service bazaga yoza olmaydi; dependency kerak, uni beradigan satr yetishmayapti.", 3: "@Injectable Entity'ga qo'yilmaydi; xabar Repository topilmaganini aytyapti." }, { 1: 'Service не пишут в providers главного модуля; сообщение про BookModule.', 2: 'Без Repository Service не сможет писать в базу; dependency нужен, не хватает строки, которая его даёт.', 3: '@Injectable на Entity не ставят; сообщение говорит, что не найден Repository.' })} />;
}

// ============================================================
//  23 · Amaliyot 4 — o'zingiz buzing
// ============================================================
const P4 = {
  kicker: 'Amaliyot 4 / 4', eyebrow: "Hozir o'zingizda · 7 daqiqa", title: "O'zingiz buzing, xabarni o'qing, tuzating", tableAt: 2,
  segments: [
    sg('a', "Oxirgi amaliyot: <b>o'zingiz buzasiz</b> — ikki qadam, xabar o'z terminalingizda", "Oxirgi amaliyot: endi o'zingiz buzasiz. Ikki qadam, yetti daqiqacha. Maqsad xabarni o'z terminalingizda ko'rish va o'qish.", { hl: [] }),
    sg('b', "1-qadam: <code>forFeature</code>ni oling, xabardan <b>klass, dependency va faylni</b> isbotga yozing, keyin qaytaring", "Birinchi: car module'dan forFeature satrini olib tashlang va saqlang, server yiqiladi. Xabardan qaysi klass, qaysi dependency, qaysi fayl ekanini toping va vergul bilan isbot maydoniga yozing. Keyin satrni joyiga qaytaring.", { hl: [0] }),
    sg('c', "2-qadam: <code>/api/v1/car/1</code> 500 beradi, sababi terminalda; <b><code>ParseUUIDPipe</code></b> qo'shsangiz — tushunarli 400", "Ikkinchi: Swagger'da car'ni id bir bilan so'rang: besh yuz. Terminalda invalid input syntax for type uuid satrini toping. Keyin Controller'da id parametriga ParseUUIDPipe qo'shing va so'rovni takrorlang: to'rt yuz. Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Katakchalar va isbot bo'lmasa, Davom ochilmaydi. Demak, endi siz besh yuz sababini terminaldan topib, uni tushunarli to'rt yuzga aylantira olasiz.", { hl: [1] }),
  ],
};
const P4_STEPS = [
  { t: "forFeature yo'q", cmds: [], exp: "car.module.ts → imports: [] → saqlang → «can't resolve dependencies of the CarService (?)» … \"CarEntityRepository\" at index [0] … CarModule module → satrni qaytaring → 5 ta Mapped" },
  { t: 'uuid', cmds: ["@Param('id', ParseUUIDPipe) id: string"], exp: 'GET /api/v1/car/1 → 500 + QueryFailedError: invalid input syntax for type uuid: "1" → ParseUUIDPipe → 400 Validation failed (uuid is expected)' },
];
const P4_TROUBLE = [
  ['Qaytardim, baribir xato', 'faylni saqladingizmi? start:dev saqlashda qayta yuklaydi — terminalda yangi satrlarni kuting'],
  ['ParseUUIDPipe topilmadi', "import @nestjs/common'dan"],
  ['/car/1 hali ham 500', "@Param('id', ParseUUIDPipe) — ikkinchi argument findOne'ga yozilganmi"],
  ['Boshqa xato', "uch savol: qaysi klass · qaysi dependency · qaysi fayl; Potential solutions ro'yxati yechimni aytadi"],
];
const P4_PROOF = { label: "Isbot: 1-qadam xabaridan — qaysi klass, qaysi dependency, qaysi fayl? (vergul bilan)", placeholder: 'klass, dependency, fayl', check: (v) => { const x = v.toLowerCase().replace(/\s/g, ''); return x.includes('carservice') && x.includes('carentityrepository') && (x.includes('car.module') || x.includes('carmodule')); }, wrong: "Xabarni qayta o'qing: «of the ___» — klass, «argument \"___\" at index [0]» — dependency, «in the ___ module» — fayl" };
function ScreenP4(p) { return <Practice p={p} S={P4} steps={P4_STEPS} trouble={P4_TROUBLE} proof={P4_PROOF} />; }
