#!/usr/bin/env python3
"""F-1125-01 2-ish TAKLIFI — Nest-1 kirish matni «Express'ni videodan o'rgangan» mentor uchun (faqat o'zbekcha).
Ko'rik sahifasi uchun VAQTINCHA qo'llanadi, suratdan keyin `git checkout -- src/mentor-kurs` bilan qaytariladi.
Tasdiqlansa — shu o'zgarishlar + ruscha (08-ru.jsx) + ovoz + MD bilan haqiqiy qo'llanadi.
Ishlatish (repo ildizidan): python3 feedback/F-1125-01-nest1-kuchaytirish/taklif/patch-2ish-nest1.py
"""
import os
P = os.environ.get('PARTS') or os.path.join(os.path.dirname(__file__), '..', '..', '..', 'src', 'mentor-kurs', 'parts')  # PARTS=<nusxa> — quruq sinov


def edit(name, pairs):
    path = os.path.join(P, name)
    s = open(path, encoding='utf-8').read()
    for old, new in pairs:
        assert s.count(old) == 1, (name, s.count(old), old[:90])
        s = s.replace(old, new)
    open(path, 'w', encoding='utf-8').write(s)
    print('ok', name, len(pairs))


edit('03-s01-s05.jsx', [
    # T1 · 1-ekran: «yozgansiz» → videodarslarda ko'rgansiz
    ('''text: "Assalomu alaykum. Siz Express bilan server yozgansiz: route ochgansiz, so'rovni qabul qilgansiz, javob qaytargansiz. Bugun shu bilimingiz ustiga NestJS qo'yamiz.''',
     '''text: "Assalomu alaykum. Siz Express'ni videodarslarda ko'rgansiz: route qanday ochilishini, so'rov qanday qabul qilinishini va javob qanday qaytishini bilasiz. Bugun shu bilim ustiga NestJS qo'yamiz.'''),
    # T2 · 2-ekran a: tanish manzara → videodarslardagi kabi
    ('''text: "Avval sizga tanish narsadan boshlaymiz, Express'dan. Mana tanish manzara: butun server bitta server js faylida.", focus: [] },''',
     '''text: "Avval tanish narsadan boshlaymiz, Express'dan. Videodarslarda ko'rganingizdek, butun server bitta server js faylida.", focus: [] },'''),
    # T3 · 2-ekran f: «Siz buni his qilgansiz» olib tashlanadi
    ('''Ikki kishi bir faylda ishlasa, har kuni to'qnashuv. Siz buni his qilgansiz. Nest aynan shu og'riq uchun yaratilgan.''',
     '''Ikki kishi bir faylda ishlasa, biri ikkinchisining o'zgarishini buzib qo'yadi. Videodarslardagi kichik loyihada bu sezilmaydi, haqiqiy jamoada esa har kuni bo'ladi. Nest aynan shu og'riq uchun yaratilgan.'''),
    # T4 · 4-ekran: tip va class (yangi ikki segment) + sarlavha
    ('''kicker: '1-bosqich · Nega Nest', title: 'TypeScript va decorator: @ belgisi',''',
     '''kicker: '1-bosqich · Nega Nest', title: 'TypeScript: tip, class va decorator','''),
    ('''Siz JavaScript bilsangiz, TypeScript'ni o'qiy olasiz.", focus: [] },''',
     '''Siz JavaScript bilsangiz, TypeScript'ni o'qiy olasiz. Avval ikki narsani ko'rib olamiz: tip va class.", focus: [] },
    { id: 'tip', key: "Tip: <code>price: number</code> — bu o'zgaruvchiga <b>faqat son</b> yoziladi, matn bersangiz dastur ishga tushmasdan xato", text: "Birinchisi, tip. price ikki nuqta number: bu o'zgaruvchiga faqat son yoziladi. Ikkinchi satrda unga matn berdik. JavaScript buni indamay qabul qilardi, TypeScript esa dastur ishga tushmasdan xato beradi: VS Code satr tagiga qizil chiziq tortadi, ishga tushirmoqchi bo'lsangiz, terminalda tip mos emasligi haqida xato chiqadi. Xato foydalanuvchiga yetmasdan, kod yozilayotganda ushlanadi.", show: "Birinchisi, <b>tip</b>. <code>price: number</code>: bu o'zgaruvchiga faqat son yoziladi. Ikkinchi satrda unga matn berdik. JavaScript buni indamay qabul qilardi, TypeScript esa dastur ishga tushmasdan xato beradi: VS Code satr tagiga qizil chiziq tortadi, terminalda <code>Type 'string' is not assignable to type 'number'</code>. Xato foydalanuvchiga yetmasdan, kod yozilayotganda ushlanadi.", focus: ['ts-let', 'ts-bad'] },
    { id: 'cls', key: "<b>class</b> — bir xil obyektlar qolipi: <code>new Car('Kia', 320)</code> qolipdan bitta mashina yasaydi", text: "Ikkinchisi, class. Class bir xil obyektlar uchun qolip. Car klassida brand va price maydonlari bor, constructor esa yangi mashina yasalayotganda shu maydonlarni to'ldiradi. new Car, qavsda Kia va uch yuz yigirma: qolipdan bitta mashina yasaladi. Nest'da Controller ham, Service ham shunday klass. Faqat ularni new bilan siz emas, Nest o'zi yaratadi; qanday qilishini uchinchi bosqichda ko'ramiz.", show: "Ikkinchisi, <b>class</b>. Class bir xil obyektlar uchun qolip. <code>Car</code> klassida <code>brand</code> va <code>price</code> maydonlari bor, <code>constructor</code> esa yangi mashina yasalayotganda shu maydonlarni to'ldiradi. <code>new Car('Kia', 320)</code>: qolipdan bitta mashina yasaladi. Nest'da Controller ham, Service ham shunday klass. Faqat ularni <code>new</code> bilan siz emas, Nest o'zi yaratadi; qanday qilishini 3-bosqichda ko'ramiz.", focus: ['ts-class', 'ts-ctor', 'ts-new'] },'''),
    ('''text: "Lekin bitta yangi narsa bor, u bilan ko'p uchrashasiz: kuchukcha belgisi bilan boshlanadigan satrlar.''',
     '''text: "Va uchinchi yangi narsa, u bilan eng ko'p uchrashasiz: kuchukcha belgisi bilan boshlanadigan satrlar.'''),
    ('''show: "Lekin bitta yangi narsa bor, u bilan ko'p uchrashasiz: <b>@</b> (kuchukcha) belgisi''',
     '''show: "Va uchinchi yangi narsa, u bilan eng ko'p uchrashasiz: <b>@</b> (kuchukcha) belgisi'''),
    ('''const S4 = {''',
     '''// F-1125-01 (2-ish): tip va class misoli — chiqish haqiqiy (TypeScript 6.0.3, nest build):
// src/misol.ts:2:1 - error TS2322: Type 'string' is not assignable to type 'number'.
const TS_LINES = [
  { id: 'ts-let', h: `<span class="k">let</span> price: <span class="k">number</span> = <span class="d">250</span>;` },
  { id: 'ts-bad', h: `price = <span class="s">'qimmat'</span>;` },
  { h: `` },
  { id: 'ts-class', h: `<span class="k">class</span> <span class="c">Car</span> {` },
  { id: 'ts-class', h: `  brand: <span class="k">string</span>;` },
  { id: 'ts-class', h: `  price: <span class="k">number</span>;` },
  { id: 'ts-ctor', h: `  <span class="k">constructor</span>(brand: <span class="k">string</span>, price: <span class="k">number</span>) {` },
  { id: 'ts-ctor', h: `    <span class="k">this</span>.brand = brand;` },
  { id: 'ts-ctor', h: `    <span class="k">this</span>.price = price;` },
  { id: 'ts-ctor', h: `  }` },
  { h: `}` },
  { id: 'ts-new', h: `<span class="k">const</span> k5 = <span class="k">new</span> <span class="c">Car</span>(<span class="s">'Kia'</span>, <span class="d">320</span>);` },
];
const TS_ERR = [
  { h: `src/misol.ts:2:1 - <span class="er">error TS2322: Type 'string' is not assignable to type 'number'.</span>` },
];
const S4 = {'''),
    ('''    <Ide files={['src/cars/cars.controller.ts']} active="src/cars/cars.controller.ts">
      <Block at={0} beat={beat}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>''',
     '''    <Ide files={beat === 1 || beat === 2 ? ['src/misol.ts'] : ['src/cars/cars.controller.ts']} active={beat === 1 || beat === 2 ? 'src/misol.ts' : 'src/cars/cars.controller.ts'}>
      {!(beat === 1 || beat === 2) && <Block at={0} beat={beat}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>'''),
    # misol ko'rinayotganda JS/TS kartalari yashiriladi — 1280×720 da sahna sig'sin (kod o'zi shuni ko'rsatadi)
    ('''      </div></Block>
      <CodePanel file="src/cars/cars.controller.ts" lines={DECO_LINES}''',
     '''      </div></Block>}
      <CodePanel file="src/cars/cars.controller.ts" lines={DECO_LINES}'''),
    ('''      <CodePanel file="src/cars/cars.controller.ts" lines={DECO_LINES} focus={seg.focus} style={{ fontSize: 15 }} />
    </Ide>
    <Block at={3} beat={beat}>''',
     '''      {beat === 1 || beat === 2
        ? <><CodePanel file={t("src/misol.ts · faqat misol, loyihada yo'q", 'src/misol.ts · только пример, в проекте нет')} lines={TS_LINES} focus={seg.focus} style={{ fontSize: 15 }} />
          {beat === 1 && <CodePanel file={t('terminal — xato', 'terminal — ошибка')} numbers={false} wrap style={{ background: '#1F1115' }} lines={TS_ERR} />}</>
        : <CodePanel file="src/cars/cars.controller.ts" lines={DECO_LINES} focus={seg.focus} style={{ fontSize: 15 }} />}
    </Ide>
    <Block at={5} beat={beat}>'''),
    # T5 · 6-ekran: 4-qadam — so'rov yuborish dasturi
    ('''text: "Endi navbat sizga. Hozirgina ko'rgan loyihani o'zingizda yaratib qo'yasiz: uchta qadam.''',
     '''text: "Endi navbat sizga. Hozirgina ko'rgan loyihani o'zingizda yaratib qo'yasiz va darsda kerak bo'ladigan dasturlarni tayyorlab qo'yasiz: to'rtta qadam.'''),
    ('''title: "Nest'ni o'rnating, loyihani boshlab qo'ying", tableAt: 4,''',
     '''title: "Nest'ni o'rnating, loyihani boshlab qo'ying", tableAt: 5,'''),
    ('''O'rnatish boshlangach, kutmang: katakchani belgilang va Davom bosing.", hl: [2] },''',
     '''O'rnatish boshlangach, kutmang: katakchani belgilang va keyingi qadamga o'ting.", hl: [2] },
    { id: 'pm', key: "4-qadam: so'rov yuborish uchun <b>Postman</b> yoki VS Code'dagi <b>Thunder Client</b>", text: "To'rtinchi: darsning o'rtasida serverga so'rov yuborasiz, buning uchun dastur kerak bo'ladi. Postman o'rnatilgan bo'lsa, shuni oching. Bo'lmasa, VS Code'ning Extensions bo'limidan Thunder Client'ni qo'shing: u ham xuddi shu ishni qiladi va VS Code ichida ochiladi.", hl: [3] },'''),
    ('''Uchala katakcha belgilanmaguncha va isbot to'g'ri yozilmaguncha Davom tugmasi ochilmaydi. Demak, shu amaliyotdan keyin kompyuteringizda Nest o'rnatilgan va yangi loyiha yaratilmoqda.''',
     '''To'rttala katakcha belgilanmaguncha va isbot to'g'ri yozilmaguncha Davom tugmasi ochilmaydi. Demak, shu amaliyotdan keyin kompyuteringizda Nest o'rnatilgan, yangi loyiha yaratilmoqda va so'rov yuborish dasturi tayyor.'''),
    ('''{ t: "Loyiha — boshlab qo'ying", cmds: ['nest new cars-api -p npm --type cjs --no-observe --skip-skills'], exp: "savol chiqmaydi · o'rnatish 1–3 daqiqa — kutmang, Davom bosing" },''',
     '''{ t: "Loyiha — boshlab qo'ying", cmds: ['nest new cars-api -p npm --type cjs --no-observe --skip-skills'], exp: "savol chiqmaydi · o'rnatish 1–3 daqiqa — kutmang, keyingi qadamga o'ting" },
  { t: "So'rov yuborish dasturi", cmds: [], exp: "Postman ochiladi yoki VS Code → Extensions → «Thunder Client» qo'shilgan (22-ekranda kerak bo'ladi)" },'''),
])

edit('04-s06-s11.jsx', [
    # T6 · 8-ekran: «yozardingiz» → 4-ekrandagi Car misoliga ko'prik
    ('''JavaScript'da this nuqta appService teng appService deb yozardingiz, bu yerda o'sha satr yozilmaydi, u o'zi bajariladi.", show: "TypeScript qisqa yozuvi: parametr oldida <code>private readonly</code> tursa, u avtomatik klass maydoni bo'ladi. JavaScript'dagi <code>this.appService = appService</code> satri yozilmaydi, u o'zi bajariladi.",''',
     '''To'rtinchi ekrandagi Car klassida buni qo'lda yozgan edik: this nuqta brand teng brand. Bu yerda o'sha satr yozilmaydi, u o'zi bajariladi.", show: "TypeScript qisqa yozuvi: parametr oldida <code>private readonly</code> tursa, u avtomatik klass maydoni bo'ladi. 4-ekrandagi <code>Car</code> klassida buni qo'lda yozgan edik: <code>this.brand = brand</code>. Bu yerda o'sha satr yozilmaydi, u o'zi bajariladi.",'''),
    # T7 · 14-ekran: «qilardingiz» → hozirgi zamon
    ('''key: "Express'da o'zingiz yaratardingiz: <code>require</code> + <code>new</code>, <b>har faylda qaytadan</b>", text: "Express'da buni o'zingiz qilardingiz: require qilib, new bilan yaratib, har kerakli faylda qaytadan.''',
     '''key: "Express'da o'zingiz yaratasiz: <code>require</code> + <code>new</code>, <b>har faylda qaytadan</b>", text: "Express'da bu ishni o'zingiz qilasiz: require qilasiz, new bilan yaratasiz, har kerakli faylda qaytadan.'''),
])

edit('05-s12-s17.jsx', [
    # T8 · 17-ekran: «yozardingiz» → hozirgi zamon
    ('''Express'da buni qo'lda, status to'rt yuz to'rt va json deb yozardingiz.", show:''',
     '''Express'da buni qo'lda yozasiz: status to'rt yuz to'rt va json.", show:'''),
    ('''Express'da buni <code>res.status(404).json</code> deb qo'lda yozardingiz.",''',
     '''Express'da buni qo'lda yozasiz: <code>res.status(404).json</code>.",'''),
    # T5 davomi · 22-ekran: Thunder Client ham
    ('''text: "To'rtinchi: brauzer yoki Postman bilan to'rtta so'rovni yuboring''',
     '''text: "To'rtinchi: brauzer, Postman yoki Thunder Client bilan to'rtta so'rovni yuboring'''),
    ('''['POST da body undefined', "Postman'da Body → raw → JSON tanlanganmi? Content-Type: application/json"],''',
     '''['POST da body undefined', "Postman yoki Thunder Client'da Body → JSON tanlanganmi? Content-Type: application/json"],'''),
])
