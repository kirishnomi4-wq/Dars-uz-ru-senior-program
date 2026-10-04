| Manba-ID | Qoida | Qamrov | Tekshiruv | Manba |
|---|---|---|---|---|
| DE-§10.anchor | Qatlamni yangi darsga ko'chirishda L1 dagi anchor `grep -n` bilan har safar qayta topiladi, qator raqamiga ishonilmaydi. | tex | ko'z | DARS_ETALON.md:1620 |
| DE-128 | `.stage-content` qoidasida `justify-content` bo'lsa, u `safe center` bo'lishi shart; yalang `center` topilma. | hamma | grep:\.stage-content[^}]*justify-content:\s*center(?! ?safe) | DARS_ETALON.md:1627 F-0820-67 |
| DE-128.a | `.stage-content` da `justify-content` umuman yo'q bo'lsa, unga `safe center` qo'shilmaydi. | hamma | grep:\.stage-content\s*\{[^}]*\} (justify-content yo'qligini ko'rish) | DARS_ETALON.md:1642 F-0820-93 |
| DE-128.b | Butun-fayl `grep -c "justify-content: center"` ishlatilmaydi; tekshiruv faqat `.stage-content` qoidasi ichida. | hamma | ko'z | DARS_ETALON.md:1655 |
| DE-129 | Jonli panel ma'lumot kelmaguncha hech narsa chizmaydi: «Yuklanmoqda», `0/0` sarlavha va hammasi 0% diagramma taqiq. | jonli | grep:Yuklanmoqda\|Hali hech kim qo'shilmagan | DARS_ETALON.md:1666 F-0819-57 |
| DE-129.b | `MentorPracticeStats`, `StudentPracticePulse`, `MentorTestStats` va ovoz-diagrammasi ma'lumotsiz holatda `null` qaytaradi. | jonli | grep:return null | DARS_ETALON.md:1680 F-0820-... |
| DE-130 | `position: fixed` qatlam `.stage-header` (progress, eyebrow, hisoblagich) zonasiga kirmaydi. | hamma | ekran:fixed elementning top<60px bilan to'qnashuvi, 1280 va 390 | DARS_ETALON.md:1689 F-0820-73 |
| DE-130.b | Suzuvchi panel faqat ma'noli ekranlarda ko'rsatiladi; ma'noli ekran topilmasa element o'chiriladi. | hamma | ko'z | DARS_ETALON.md:1705 |
| DE-130.c | Suzuvchi panel birinchi ekranda bo'sh (masalan to'rtta bo'sh katak) holatda ko'rsatilmaydi (≈DE-129). | hamma | ekran:birinchi ekrandagi suzuvchi panel | DARS_ETALON.md:1701 |
| DE-131 | «TEGMA» belgisi faqat mexanika va matn-mazmunni himoya qiladi; bezak umumiy qonunlarga bo'ysunadi. | hamma | ko'z | DARS_ETALON.md:1713 F-0820-87 |
| DE-131.b | «TEGMA» ekranida topilgan bezak-topilma «bahsli joylar» ro'yxatiga chiqadi, jim o'chirilmaydi. | hamma | ko'z | DARS_ETALON.md:1731 |
| DE-132 | Holat-modifikatori (`.ready`, `.on`, `.active`, `.selected`, `.is-*`) fonni almashtirsa, matn rangi ham beriladi; kontrast kamida 3:1. | hamma | grep:\.(ready\|on\|active\|selected)\s*\{\s*background (color yo'qligini ko'rish); `lint:dark` | DARS_ETALON.md:1734 F-0820-79 |
| DE-132.b | Rang-juftligining bir yarmi o'zgarsa, ikkinchi yarmi ham ko'riladi (`background`↔`color`, `border`↔`background`). | hamma | ko'z | DARS_ETALON.md:1752 |
| DE-133 | Tanlov-mashqida har tanlangan variantga hukm bilan birga qisqa sabab ko'rsatiladi. | hamma | grep:why:\s*\{ | DARS_ETALON.md:1757 F-0820-103 |
| DE-133.b | Sabab-matni ma'lumot-massivida (`{ k, ok, why: { uz, ru } }`) yashaydi va JSX da render qilinishi shart. | hamma | grep:why: | DARS_ETALON.md:1768 F-0820-97 |
| DE-133.c | Xato tanlangan qator foni to'g'ri tanlovnikidan farq qiladi; xato tanlov yashil ko'rinmaydi (`.pick-row.on.bad`). | hamma | ekran:xato tanlangan qator foni | DARS_ETALON.md:1774 |
| DE-134 | Bir klass bitta rol uchun ishlatiladi; ikkinchi rol uchun yangi klass ochiladi, inline fon-yamoq qo'yilmaydi. | hamma | grep:className="[a-z-]+" style=\{\{ background | DARS_ETALON.md:1788 F-0820-116 |
| DE-134.b | So'zlovchi-palitrasi: AI `.ai-badge` ko'k `T.blue`, mentor `T.accent` to'liq, tengdosh `.peer-badge` `T.ink2`. | hamma | grep:ai-badge\|peer-badge | DARS_ETALON.md:1801 |
| DE-134.c | `T.success` so'zlovchiga berilmaydi, chunki u hukm-rangi. | hamma | grep:(badge\|speaker)[^\n]*T\.success | DARS_ETALON.md:1812 |
| DE-134.d | O'quvchining o'zi uchun `.you-badge` accent KONTUR (oq fon, accent matn va chegara), to'ldirilmaydi. | hamma | grep:you-badge | DARS_ETALON.md:1808 F-0820-144 |
| DE-§134.dbg | Debugging ekranida o'quvchi qilganini takrorlaydigan bo'sh maqtov `takeaway` taqiq; mazmunli qoida-eslatma qoladi. | hamma | ko'z | DARS_ETALON.md:1819 F-0820-89 |
| DE-135 | Kirish-animatsiya klassi (`.fade-up`) va `animation` beradigan holat-klass bir `className` da turmaydi; kirish o'rovchiga ko'chadi. | hamma | grep:fade-up[^"`]*(invite\|pulse\|shake); `lint:jsx` | DARS_ETALON.md:1844 F-0820-136 |
| DE-135.b | `.fade-step`, `.el-in` kabi fill'siz o'tishlar topilma emas. | hamma | ko'z | DARS_ETALON.md:1872 |
| DE-136 | `firstAttemptCorrect` va `correct` serverga haqiqiy holatdan hisoblanadi (`wrongCount === 0`), qattiq `true` yozilmaydi. | hamma | grep:firstAttemptCorrect:\s*true | DARS_ETALON.md:1897 F-0820-137 |
| DE-136.b | Bajarish-ekranlarida (`practice`, `koding`) `correct: true` qonuniy, lekin `firstAttemptCorrect` yozilmaydi. | jonli | grep:firstAttemptCorrect | DARS_ETALON.md:1922 |
| DE-137 | Hook-ekranda «Aynan!»/«Topdingiz!» maqtovi faqat to'g'ri tanlovga beriladi, har tanlovga bir xil maqtov taqiq. | hamma | grep:hook-ack | DARS_ETALON.md:1929 F-0820-171 |
| DE-137.b | Hook-ekranda `correct` faqat haqiqiy shartdan (`v === correct`) olinadi, qattiq `true` yozilmaydi (≈DE-136). | jonli | grep:stage: 'hook'[^\n]*correct: true | DARS_ETALON.md:1938 |
| DE-137.c | Hook-ekranda xato tanlovga uyaltirmaydigan ko'prik-gap beriladi va keyingi ekranga intriga quriladi. | hamma | ko'z | DARS_ETALON.md:1942 |
| DE-137.d | Sof so'rovnoma hookda `correct: false` hammaga yoziladi va maqtov berilmaydi. | jonli | ko'z | DARS_ETALON.md:1955 |
| DE-§izoh.namuna | Birinchi-marta ekranda to'liq namuna mumkin; takror-mavzuda namuna qisman beriladi yoki berilmaydi, o'quvchi o'zi yozadi. | hamma | ko'z | DARS_ETALON.md:1962 |
| DE-138 | Qulflangan `NavNext` yorlig'i harakatni aytadi; qulf holatida «Davom etish» yozilmaydi. | hamma | grep:disabled=\{[^}]*\}[^\n]*Davom etish | DARS_ETALON.md:1980 F-0820-181 |
| DE-138.b | Uch daraja tartibda: qulf-yorliq doim, ipucha 40 s/25 s dan, rescue 110 s/60 s dan; yorliqsiz ipucha va klapan qo'yilmaydi. | hamma | ko'z | DARS_ETALON.md:1993 |
| DE-138.c | Qulf-yorlig'ida ikkala shoxi ham «Davom etish» bo'lgan `label={done ? ... }` topilma. | hamma | grep:label=\{done \? \{ uz: 'Davom etish' | DARS_ETALON.md:2001 |
| DE-138.d | Ballik (`INLINE_KEYS` bilan bog'langan) ekranda rescue ochilgach yorliq «Davom etish» emas, keyingi harakatni aytadi. | hamma | grep:_resc \? | DARS_ETALON.md:2007 4a-02 |
| DE-138.e | Ballsiz ekranda rescue holatidagi «Davom etish» yorlig'i to'g'ri hisoblanadi. | hamma | ko'z | DARS_ETALON.md:2012 |
| DE-139 | Hukm chiqariladigan variant yorlig'ida ✅ ❌ ✔ ☑ belgisi hukmdan oldin turmaydi. | hamma | grep:(opts\|options\|VARIANTS\|CARDS\|CHOICES\|answers)[^\n]*[✅❌✔☑] | DARS_ETALON.md:2023 F-0820-299 |
| DE-139.b | Belgi hukmdan keyin, tanlovsiz kartada, tadqiqot tugmasida va ❌→✅ o'quv-qiyoslashda ruxsat; chegara: o'quvchi hukm qiladimi yoki ko'rsatma bajaradimi. | hamma | ko'z | DARS_ETALON.md:2037 |
| DE-140 | Ballik savolning har noto'g'ri varianti darsning o'z qoidasi bo'yicha ham noto'g'ri bo'ladi, «kalit emas» yetarli emas. | hamma | ko'z | DARS_ETALON.md:2066 F-0820-300 |
| DE-140.b | Har chalg'ituvchining noto'g'riligi sababi darsda tushuntirilgan bo'ladi. | hamma | ko'z | DARS_ETALON.md:2085 |
| DE-140.c | Chalg'ituvchi aniq bir yanglish tasavvurni gavdalantiradi; hech kim tanlamaydigan variant o'lik yuk. | hamma | ko'z | DARS_ETALON.md:2088 |
| DE-141 | Darsda marosim (`AchCelebrate`, konfetti, `OpeningAct`) bitta bo'ladi va birinchi-marta lahzasiga qo'yiladi. | hamma | grep:AchCelebrate\|confetti\|OpeningAct\|celebrate | DARS_ETALON.md:2099 |
| DE-141.b | Praktika-done, recap, takrorlash va flashcard-yakunida marosim yo'q, faqat `done-mini` tasdiq qoladi. | hamma | ko'z | DARS_ETALON.md:2110 |
| DE-142.a | Har `<button>` kamida bittasiga ega: to'ldirilgan rang, oq yuza va 1px ramka yoki soya; fon=sahifa foni va `border: none` taqiq. | hamma | grep:btn-\w*\s*\{ (background T.bg ni ko'rish) | DARS_ETALON.md:2151 F-0824-01 |
| DE-142.b | Ko'p qadamli ekranda navbat shu qadamda `.btn-turn`, kelmagan `.btn-soft`, bajarilgan `.btn-did`; holat bajarilganlikka bog'lanadi. | hamma | grep:btn-turn\|btn-did | DARS_ETALON.md:2157 |
| DE-142.b2 | `.btn-turn` pulsatsiyasi `prefers-reduced-motion: reduce` da o'chadi. | hamma | grep:prefers-reduced-motion | DARS_ETALON.md:2168 |
| DE-142.c | Bloklangan `NavNext` yorlig'i qolgan qadamni nomma-nom aytadi («1-usulni sinang»), ayblamaydi (≈DE-138). | hamma | ko'z | DARS_ETALON.md:2171 |
| DE-143.a | `isMentor` bilan bloklangan har elementda `disabled={isMentor}` va `:disabled` uslubi bo'ladi; jim qaytadigan `onClick` taqiq. | jonli | grep:isMentor | DARS_ETALON.md:2193 F-0824-02 |
| DE-143.b | Mentor rejimida vazifa-yorlig'i bloklanish sababini aytadi («Bu topshiriqni o'quvchilar bajaradi — siz kuzatasiz»). | jonli | ko'z | DARS_ETALON.md:2198 |
| DE-143.c | Har tekshiruv-ekranida mentor to'g'ri javobni doskaga ochadi (`MentorTestStats` `onReveal`), qadam-baqadam. | jonli | grep:onReveal | DARS_ETALON.md:2203 |
| DE-143.d | Reveal `onAnswer`/`live.submitAnswer` ni ishga tushirmaydi: `if (done && !isMentor && …)`. | jonli | grep:submitAnswer | DARS_ETALON.md:2210 |
| DE-144.a | Ko'chiriladigan kod ro'yxatida `white-space: pre-wrap` va `overflow-wrap: break-word` bo'ladi; `nowrap` yoki `normal` bilan almashtirilmaydi. | hamma | grep:white-space:\s*nowrap | DARS_ETALON.md:2226 F-0824-06 |
| DE-144.b | Ko'chiriladigan kodda ligatura o'chiriladi: `font-feature-settings: "liga" 0, "calt" 0`. | hamma | grep:font-feature-settings | DARS_ETALON.md:2240 |
| DE-144.c | Qoida faqat ko'chiriladigan kontekstga tegishli; test, flashcard va proza chiplariga tegilmaydi, 45 belgidan uzun chip ekranda sig'ishi tekshiriladi. | hamma | ekran:ko'chirish-ro'yxati chiplari 1280 va 390 | DARS_ETALON.md:2248 |
| DE-145.a | `className` da ishlatilgan har sinf shu faylning `<style>` blokida e'lon qilinadi; boshqa darsdan sinf meros olinmaydi. | hamma | grep:className="X" bor, .X e'loni yo'q (skript bilan solishtirish) | DARS_ETALON.md:2267 F-0824-10 |
| DE-145.b | Yo'q sinf jim buzilish bo'lib, darvozalar ko'rmaydi; uni ko'z yoki maxsus detektor tutadi. | hamma | ko'z | DARS_ETALON.md:2273 |
| DE-145.c | Sinf qiymatlari modulning mavjud darsidan ko'chiriladi, yangi dizayn o'ylab topilmaydi. | hamma | ko'z | DARS_ETALON.md:2278 |
| DE-146.a | Bittasi tanlanadigan chip radio-doira, ko'rinadigan chegara va ikonka bilan tanlov-karta bo'ladi (`role="radiogroup"`, `role="radio"`, `aria-checked`). | hamma | grep:role="radio" | DARS_ETALON.md:2297 F-0827-01 |
| DE-146.a2 | Tanlov-chipda `border: none` yoki fon `T.bg` taqiq. | hamma | grep:\.chip\s*\{[^}]*border:\s*none | DARS_ETALON.md:2316 |
| DE-146.b | Bosqich-navigatsiya raqam-doira, «N-bosqich» yorlig'i va bog'lovchi chiziqli stepper; nomlar chipda emas. | hamma | ekran:stepper uch holati (tugagan, joriy, kelgusi) | DARS_ETALON.md:2306 F-0827-02 |
| DE-146.b2 | 640px dan kichik ekranda stepper yorlig'i yashirinadi, raqam-doira qoladi. | hamma | ekran:stepper 390px | DARS_ETALON.md:2313 |
| DE-147.a | `.zoom-btn` burchagiga tushadigan qatorga 40px o'ng chekinish (`.zb-gap` yoki inline `paddingRight: 40`) beriladi. | hamma | grep:zb-gap\|paddingRight: 40 | DARS_ETALON.md:2326 F-0912-03 |
| DE-147.a2 | Inline `padding` qisqartmasi `.zb-gap` ni yutadi, shuning uchun chekinish inline obyektga qo'shiladi. | hamma | grep:padding: '[^']+'[^\n]*zb-gap | DARS_ETALON.md:2338 |
| DE-147.a3 | To'qnashuvni yopish uchun zoomable'ga `padding-top` berilmaydi, kontent siljitilmaydi (≈DE-60). | hamma | ko'z | DARS_ETALON.md:2343 |
| DE-147.a4 | Matn tugma bilan to'qnashsa `.zb-notch::before` float-notch, tugma/chip qatorida hammasiga bir xil o'ng zaxira beriladi. | hamma | grep:zb-notch | DARS_ETALON.md:2350 F-0912-09 |
| DE-147.a5 | Bir qutining hamma holat-matnlariga (ipucha, noto'g'ri tanlov, topildi, yakun) notch qo'yiladi; `grep -c zb-notch` = 1 + holatlar soni. | hamma | grep:zb-notch | DARS_ETALON.md:2376 |
| DE-147.a6 | To'qnashuv o'lchanadi va qamrov bo'yicha yopiladi; faqat media-query ichida yoki bitta ekranda yopish tuzatish emas. | hamma | ekran:⛶ ostidagi matn 1280 va 390 | DARS_ETALON.md:2383 |
| DE-147.a-2 | Maket bezagi (`.phone-notch`, brauzer tasmasi, soat-paneli) maket ichidagi matnni yopmaydi. | hamma | ekran:maket ichidagi birinchi qator matni | DARS_ETALON.md:2389 F-0912-14 |
| DE-147.a-2b | Bir nomli maket-bezak darslararo bir xil o'lchamda bo'ladi; bezak ramka chekinishi ichida joylashadi, kontent surilmaydi. | hamma | grep:phone-notch | DARS_ETALON.md:2401 F-0912-14 |
| DE-147.b | O'lchami ma'lumotga bog'liq idishga (proporsional `flex`) matn qo'yilmaydi; nomlar tashqaridagi ro'yxatda turadi. | hamma | ekran:proporsional kartalar matni 1280 va 390 | DARS_ETALON.md:2408 |
| DE-147.b2 | `text-overflow: ellipsis` nom, sarlavha va topshiriq matnida ishlatilmaydi; faqat takrorlanadigan ikkinchi darajali ma'lumotda ruxsat. | hamma | grep:text-overflow:\s*ellipsis | DARS_ETALON.md:2420 |
| DE-147.c | Matn sig'ishi grep bilan emas, brauzerda o'lchov bilan tekshiriladi (A qirqilish, B ustma-ust, C matn chiqishi, D boshqaruv matn ustida), uz/ru x self/mentor. | hamma | ekran:`_clip-audit` to'rt detektor, 1280x773 va 1366x768 | DARS_ETALON.md:2425 |
| DE-147.c1 | O'lchov asbobi yolg'on signalsiz kalibrovkalanadi: shaffof qatlam, modal, orqa yuz va burilgan element sanalmaydi. | hamma | ko'z | DARS_ETALON.md:2435 F-0912-09 |
| DE-147.c2 | Bitta grid katakchasi, manfiy chekinish bilan ulangan shakl (≤3px), idishning o'z pardasi (≥92%) va chetdan chiqadigan panel kesishuv deb sanalmaydi. | hamma | ko'z | DARS_ETALON.md:2458 F-0912-10 |
| DE-147.c3 | O'lchov hisobotidagi ekran soni kutilganidan kam bo'lsa, «toza» emas, tergov boshlanadi; ekranlar soni `NN / NN` hisoblagichidan olinadi. | hamma | ekran:ekranlar soni tasdig'i | DARS_ETALON.md:2468 |
| DE-147.c4 | Kalibrovka qoidasi bitta detektorga emas, sababga bog'lanadi; so'nayotgan (`opacity < 0.35`) element o'lchanmaydi. | hamma | ko'z | DARS_ETALON.md:2478 F-0912-11 |
| DE-147.c5 | Kalibrovka o'zgargach `--selftest` majburiy: ataylab toshiruvchi CSS topilmasa detektor o'lik hisoblanadi. | hamma | ko'z | DARS_ETALON.md:2490 |
| DE-147.c6 | O'lchovda chekli animatsiya oxirigacha kutiladi; cheksiz animatsiyali element o'lchanmaydi; `z-index` teng bo'lsa DOM'da keyingisi ustida deb olinadi. | hamma | ko'z | DARS_ETALON.md:2494 |
| DE-147.c7 | Interaktiv holatlar (javobdan keyin) o'lchovga kiradi: bosiladigan elementlar ketma-ket bosilib qayta o'lchanadi; bosish soni 0 bo'lsa ogohlantirish chiqadi. | hamma | ekran:javobdan keyingi holat | DARS_ETALON.md:2510 |
| DE-147.d | Suzuvchi qatlamning `top` + balandligi u tushadigan birinchi matn qatorining yuqori chetidan kamida 3px kichik bo'ladi, kontent surilmaydi. | hamma | ekran:fixed qatlam va `.eyebrow` y-oralig'i, 1280 / 1366 / 1024 | DARS_ETALON.md:2527 F-0912-06 |
| DE-147.d2 | Suzuvchi qatlam balandligi ichki chekinishdan qisqartiriladi, boshqaruv o'lchamidan emas (tugma 22px qoladi). | hamma | ekran:suzuvchi tugma balandligi | DARS_ETALON.md:2545 |
| DE-147.e | Javobdan keyingi holat (izoh, takrorlash tugmasi, ochilgan qadam) ham pastki navigatsiya chizig'iga sig'adi. | hamma | ekran:xato va to'g'ri javob holatida ekran tubi, 1280 va 390 | DARS_ETALON.md:2554 F-0913-02 |
| DE-147.e2 | Sig'dirish uchun bo'sh ustunga ko'chiriladi yoki kutayotgan qadam ixcham, faol qadam to'liq qilinadi; shriftni kichraytirish va «baribir skroll bor» taqiq (≈DE-60). | hamma | ko'z | DARS_ETALON.md:2568 |
| DE-147.e3 | `className="term"` ishlatgan har fayl `.term {` qoidasini ham saqlaydi (≈DE-145). | hamma | grep:className="term" va \.term\s*\{ | DARS_ETALON.md:2619 F-0913-03 |
| DE-147.e4 | O'lchov asbobi yig'ilgan Mentor qatorini va ochiq akkordeonni o'lchovdan keyin tiklaydi; ko'rinmas matn D-detektordan chiqariladi. | hamma | ko'z | DARS_ETALON.md:2625 |
| DE-148.1 | Kompyuter kengligida Mentor qatori ochiq turadi; yig'ilish faqat tor ekranda: `collapseOn = isNarrow && !mentorStatic`. | hamma | grep:collapseOn = isNarrow && !mentorStatic | DARS_ETALON.md:2641 F-0914-08 |
| DE-148.2 | Joy yetmasa joylashuv o'zgaradi (bo'sh ustun, ixcham qadam, `CodeFile maxH`, `<details>`), Mentorni yig'ish yechim sifatida taqiq. | hamma | ekran:Mentor qatori kompyuterda ochiq, 1366 | DARS_ETALON.md:2662 |
| DE-148.3 | Joy tanqisligida avval Mentor matni ortiqchaligi tekshiriladi, keyin quti (≈DE-109, 400 belgi). | hamma | ko'z | DARS_ETALON.md:2668 |
| DE-148.4 | 7-modul hali `collapseOn = !mentorStatic` bilan turadi; u qayta yig'ilganda shu qonun bilan quriladi. | tex | grep:collapseOn = !mentorStatic | DARS_ETALON.md:2656 |
| DE-149.1 | Jonli sinfdagi o'quvchida dars-ichi mashq `live.mode === 'student' && live.status !== 'ended'` shartida ochiladi, `live.mentorAlive` shartga kirmaydi. | jonli | grep:status !== 'ended' && live.mentorAlive | DARS_ETALON.md:2675 F-0914-11 |
| DE-149.2 | Mashqsiz o'tish faqat mentor «Erkin qilish»ni bosganda yoki o'quvchi jonli sinfda bo'lmaganda mumkin. | jonli | ko'z | DARS_ETALON.md:2688 |
| DE-149.3 | `mentorAlive` faqat yumshatish uchun ishlatiladi (darvoza-qulf, `freeRide`, flashcard yashirish); undan hech narsa olib tashlanmaydi. | jonli | grep:inLiveClass = .*mentorAlive | DARS_ETALON.md:2692 |
| DE-149.4 | `LIVE_STALE_MS` chegarasi o'zgarsa `live_mentor_gaps` uchun yangi migratsiya yoziladi; yangi dars `next()` ni 14 ta namuna darsdagi shaklda yozadi. | jonli | grep:F-0914-11 \(2026-09-15\) | DARS_ETALON.md:2695 |
| DE-150.1 | `.h-title` qoidasi `font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance` bo'ladi. | tex | grep:\.h-title \{ font-size: clamp\(22px,4vw,36px\) | DARS_ETALON.md:2726 F-0915-01 |
| DE-150.2 | `.h-title` ga inline `maxWidth` qo'yilmaydi; kenglikni `.screen` / `.head` belgilaydi. | tex | grep:h-title[^>]*maxWidth | DARS_ETALON.md:2727 |
| DE-150.3 | Sarlavha shrifti 34px dan kichik bo'lmaydi; tanlangan qiymat 36px. | tex | grep:\.h-title[^}]*font-size: clamp\([^)]*3[0-3]px | DARS_ETALON.md:2728 |
| DE-150.4 | Ikki qatorga bo'linadigan sarlavha `balance` bilan teng bo'linadi, oxirgi qatorda yolg'iz so'z yoki emoji qolmaydi. | tex | ekran:sarlavha qatorlari 1366 uz/ru | DARS_ETALON.md:2730 |
| DE-150.5 | Sarlavha matni sig'dirish uchun foydalanuvchi rozilig'isiz o'zgartirilmaydi. | hamma | ko'z | DARS_ETALON.md:2732 |
| DE-150.6 | Oddiy matnda shriftni kichraytirib sig'dirish taqiq; `.h-title` 36px yagona istisno (≈DE-147, ≈DE-148). | hamma | ko'z | DARS_ETALON.md:2733 |
| DE-150.7 | PM 26px sarlavhalari (`clamp(20px,2.6vw,26px)`), `.h-title.h-center` va `src/eski`, demo papkalari 150-qonun qamrovidan tashqari. | PM | ko'z | DARS_ETALON.md:2735 |
| DE-151.1 | `ACH_TRIGGERS` ga bog'langan test bo'lmagan ekranda nishon faqat birinchi urinish to'g'ri bo'lsa beriladi; xatodan keyin qayta urinish nishonsiz. | tex | grep:AchMissCtx\|AchRule | DARS_ETALON.md:2756 F-0918-04 |
| DE-151.2 | «Urinish» tekshirilgan to'liq javob hisoblanadi, har bir harakat emas; bo'lakni qaytarib qo'yish urinish emas. | hamma | ko'z | DARS_ETALON.md:2770 |
| DE-151.3 | Nishon sharti topshiriq ostida `AchRule` xira qatorida oldindan aytiladi: «Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.» | hamma | grep:AchRule | DARS_ETALON.md:2780 |
| DE-151.4 | Xatodan keyingi qator jazo ohangisiz yoziladi; qizil rang, undov va «afsus» taqiq (MATN_KORPUS §183). | hamma | ko'z | DARS_ETALON.md:2782 |
| DE-151.5 | «Birinchi urinish xato bo'ldi» belgisi `ccProgress` `missed` ga yoziladi va F5 uni o'chirmaydi. | tex | grep:missed | DARS_ETALON.md:2784 |
| DE-151.6 | «Qaytadan» bosilganda birinchi o'tish `firstPass` ga muhrlanadi; shundan keyin nishonlar muzlaydi, `AchRule` yashiriladi, test javoblari yozilmaydi. | jonli | grep:firstPass | DARS_ETALON.md:2786 |
| DE-151.7 | Test savoli, `graduate`, exploration ekranlari, mentor ekrani va School API payload'iga 151-qonun tegmaydi. | hamma | ko'z | DARS_ETALON.md:2795 |
| DE-151.k1 | Kod naqshi: `missed` va `practice` effekt-deps'da bo'ladi, aks holda F5 dan keyin birinchi urinish belgisi yo'qoladi. | tex | grep:\[screen, answers, earned, missed, practice\] | DARS_ETALON.md:2808 |
| DE-151.k2 | Tekshiruv: har test bo'lmagan `ACH_TRIGGERS` kaliti uchun ekranda `AchRule` bor va xato yo'lida `miss(screen)` chaqiriladi. | tex | grep:AchRule\|miss\( | DARS_ETALON.md:2812 |
| DE-152.1 | Bir darsda kafolatli (tekin) nishon ko'pi bilan ikkita: `graduate` va bitta bonus; ikkinchi tekin nishon testga yoki topshiriqqa ko'chiriladi. | hamma | grep:ACH_TRIGGERS | DARS_ETALON.md:2830 F-0918-06 |
| DE-152.2 | Bonus faqat o'quvchi ish qilgan ekranda yoki uzun ishning yakunida o'rinli; ekran ochilishining o'zi uchun bonus berilmaydi. | hamma | ko'z | DARS_ETALON.md:2834 |
| DE-152.3 | Bonus `desc` faqat qilingan ishni aytadi («ochdingiz», «ko'rdingiz») va mahorat da'vo qilmaydi («to'g'ri bog'ladingiz» taqiq). | hamma | grep:desc:[^\n]*(to'g'ri bog'ladingiz\|bo'ldingiz) | DARS_ETALON.md:2837 |
| DE-152.4 | Bonus ekranida `AchRule` ko'rsatilmaydi; «sinab ko'ring» ekranida tanlovlardan birini nishonsiz qoldirish taqiq. | hamma | grep:AchRule | DARS_ETALON.md:2841 |
| DE-152.5 | Mehnat nishoni (erkin yozma ish, ekrandan tashqari ish) bonus hisobiga kirmaydi va `AchRule` siz bo'ladi. | hamma | ko'z | DARS_ETALON.md:2844 |
| DE-152.6 | «Qaytadan» mashqi (≈DE-151.6) bonus va mehnat nishoniga ham tegishli: nishonlar muzlaydi. | hamma | grep:firstPass | DARS_ETALON.md:2848 |
| DE-152.7a | Kod yozish (`pickKod`/`ScreenCoding`) va yagona javobsiz o'z-qaror mashqi mehnat nishoni; PM darslarida tekin 4-ekran o'sha darsning yagona bonusi. | PM | ko'z | DARS_ETALON.md:2852 |
| DE-152.7b | Faqat xato qator bosiladigan debug-ekran bonus emas: hamma qator bosiladi, xatosiz qator uchun «Bu qatorda xato yo'q — yana qarang.» + `miss`. | hamma | grep:Bu qatorda xato yo'q | DARS_ETALON.md:2857 |
| DE-152.7c | Ko'p-bandli topshiriqda bitta bilim-xatosi nishonni oladi; sirpanish (zonadan tashqari, band qator) urinish emas; qayta urinishsiz ekranda `<AchRule screen={screen} once />`. | hamma | grep:AchRule screen=\{screen\} once | DARS_ETALON.md:2861 |
| DE-152.8 | Qayta urinishli ekranda `AchRule` yakundan keyin yashiriladi (`{!done && <AchRule …/>}`), `once` ekranda qoladi. | hamma | grep:!done && <AchRule | DARS_ETALON.md:2896 |
| DE-152.9 | `AchRule` qatori topshiriq ostida, ikkinchi bosqichda ochiladigan ekranda bosqich-blokdan tashqarida turadi; rangi fonga kontrast ≥4.5:1. | hamma | ekran:AchRule kontrasti | DARS_ETALON.md:2897 |
| DE-152.10 | Ekrandan tashqari beriladigan nishon (`earn('…')`) ham o'sha topshiriqning `missed` belgisiga bo'ysunadi. | hamma | grep:earn\(' | DARS_ETALON.md:2899 |
| DE-152.11 | Test deb belgilangan tartiblash ekranida `correct` birinchi to'liq urinish bo'ladi; jonli kalit `-1` → `0`, `picked: first ? 0 : 1`. | jonli | grep:picked: first \? 0 : 1 | DARS_ETALON.md:2901 |
| DE-152.12 | Har test bo'lmagan `ACH_TRIGGERS` kaliti 151-naqsh, bonus yoki mehnat nishonidan biriga tushadi; hech biriga tushmagan kalit topilma. | hamma | grep:ACH_TRIGGERS | DARS_ETALON.md:2905 |
| DE-153.1 | Test balli birinchi TO'LIQ urinishdan olinadi (MCQ bilan bir xil); sirpanish (bo'lakni qaytarish, qisman javob) urinish emas. | jonli | ekran:xato→to'g'ri = `correct: false` | DARS_ETALON.md:2912 |
| DE-153.2 | Maxsus ball-ekran yakunda `solved: true`, `correct` va `firstAttemptCorrect` birinchi urinishdan, `picked: first ? 0 : 1` yozadi (≈DE-136). | jonli | grep:solved: true | DARS_ETALON.md:2918 |
| DE-153.2b | Birinchi urinish `missed` ga yoziladi (`achMiss.miss(screen)`); ekran holati `storedAnswer.solved \|\| storedAnswer.correct` dan tiklanadi. | jonli | grep:storedAnswer\.solved | DARS_ETALON.md:2921 |
| DE-153.3 | Kalit `-1` faqat diskret urinishsiz yozma testda; xato yo'li bor testda kalit `0` yoki to'g'ri variant indeksi. | jonli | grep:-1 (quiz_keys) | DARS_ETALON.md:2925 |
| DE-153.4 | Ball uch kanalda (jonli, solo, `onFinished`) bir xil yoziladi; solo da maxsus test javobi `submit_answer` bilan serverga ketadi. | jonli | grep:submit_answer | DARS_ETALON.md:2929 |
| DE-153.5 | «Qaytadan» mashqi hech bir kanalga yozilmaydi (≈DE-151.6). | jonli | ko'z | DARS_ETALON.md:2935 |
| DE-154 | Bo'lak/blok/karta uyumida to'g'ri javob uyum boshida yoki tartib bilan turmaydi; tartib kodda barqaror aralashtiriladi, tasodifiy emas. | hamma | ekran:uyumning birinchi bloki javob emasligi | DARS_ETALON.md:2930 D1 |
| DE-155.1 | Darsda o'quvchi ochadigan har tashqi manzil (`http…`) yozilganda va muhr oldidan tirikligi tekshiriladi; o'lik manzil dars xatosi. | hamma | grep:https?://[a-z0-9.-]+ (har biriga so'rov) | DARS_ETALON.md:2952 F-0921-05 |
| DE-155.2 | Tashqi shartga bog'langan amaliyot ekranida `🛟` sarlavhali yopiq `<details>` zaxira-panel chap ustunda bo'ladi (`dsx-fb`). | hamma | grep:dsx-fb | DARS_ETALON.md:2960 |
| DE-155.2b | Zaxira panel ishlaydigan yo'l beradi (tayyor kod, boshqa tizim qadamlari, mentor bilan); «keyinroq qilasiz» zaxira yo'l emas. | hamma | ko'z | DARS_ETALON.md:2962 |
| DE-155.3 | Zaxira yo'l ham yurmasa o'quvchi qadamni belgilab keyingi ekranga o'tadi; ball beradigan ekranlarga bu band tegmaydi. | hamma | ko'z | DARS_ETALON.md:2965 |
| DE-156.1 | Keysdagi brend/kompaniya/joy nomi darsda birinchi ko'rinishda bir qatorli izoh bilan keladi: nimaligi, qiymati emas. | hamma | ko'z | DARS_ETALON.md:2985 F-0921-21 |
| DE-156.2 | Brend izohi har darsda qaytariladi, lekin o'sha darsda ikkinchi marta takrorlanmaydi. | hamma | ko'z | DARS_ETALON.md:2993 |
| DE-156.3 | Brend javob bo'lgan ekranda izoh variantga emas, javob ochilgandan keyingi gapga qo'yiladi (MATN_KORPUS §186). | hamma | ko'z | DARS_ETALON.md:2997 |
| DE-156.4 | Chizib bo'ladigan referent foto kutmasdan loyihaning maket-an'anasi (`BrowserWin`, `PhoneMock`, `AltairMock`) bilan chiziladi; foto faqat chizib bo'lmaydigan referentga. | hamma | grep:BrowserWin\|PhoneMock\|AltairMock | DARS_ETALON.md:3003 F-0922-01 |
| DE-156.5 | Maket faqat tushunchani olib keladigan joyga qo'yiladi; olib tashlansa gap tushunarsiz qolmasa, maket bezak va qo'yilmaydi (≈DE-109). | hamma | ko'z | DARS_ETALON.md:3011 |
| DE-156.6 | Bashorat/savol ekranida maket javob ochilgandan keyin chiqadi, javobni oldindan aytmaydi; maket qo'yilganda keyingi ekran so'rovi tekshiriladi. | hamma | ko'z | DARS_ETALON.md:3011 |
| DE-156.7 | Ikki tilli darsda maketning `aria-label` i `tr({uz,ru})` bilan uz+ru bo'ladi; faqat o'zbekcha dars (`PmLesson19–25`, 7-Modul) bir tilli qoladi. | ru | grep:aria-label=\{tr\( | DARS_ETALON.md:3017 |
| DE-156.8 | Rasm (`Photo`, `PHOTO_SET`) yuklanmasa dars to'xtamaydi; rasm faqat media-kutubxonadan, `alt` uz+ru (tavsiya). | hamma | grep:PHOTO_SET\|<Photo | DARS_ETALON.md:3021 |
| DE-156.9 | Maket qo'yilganda `shot-screen.mjs` bilan ru rejimda ko'z bilan ko'riladi (emoji kontrasti, ustun tekisligi). | ru | ekran:maket skrinshoti ru, 1280 | DARS_ETALON.md:3028 F-0922-01 |
| DE-157.1 | Arena javob ochilgach 6 sekunddan (`AUTO_NEXT_MS`, `src/live/useAutoNext.js`) keyin o'zi keyingi savolga o'tadi; 2 s yetmaydi. | jonli | grep:AUTO_NEXT_MS\|useAutoNext | DARS_ETALON.md:3042 F-0922-03 |
| DE-157.2 | Avto-o'tish soati faqat mentor brauzerida yuradi; o'quvchilar server orqali ergashadi. | jonli | ko'z | DARS_ETALON.md:3048 |
| DE-157.3 | To'xtatish tugmasi yopishqoq: bir marta bosilsa avto arena oxirigacha o'chadi; qaytarish «▶ Avto» tugmasi bilan. | jonli | grep:qz-auto | DARS_ETALON.md:3050 |
| DE-157.4 | Oxirgi savolda va solo rejimda avto-o'tish yo'q; g'oliblarni e'lon qilish mentorning qo'lida qoladi. | jonli | ko'z | DARS_ETALON.md:3055 |
| DE-157.5 | Qo'lda va avto o'tish bitta hookdan (`fireNow`) o'tadi, ikki marta `ctrl('q', qi+1)` ketmasligi uchun qulf bor. | jonli | grep:fireNow | DARS_ETALON.md:3058 |
| DE-157.6 | Arena tugma yozuvida `⏸` belgisi ishlatilmaydi; matn bilan «To'xtatish · 5» / «▶ Avto» yoziladi. | jonli | grep:⏸ | DARS_ETALON.md:3062 |
| DE-157.7 | Avto-o'tish mantiqi faqat `src/live/useAutoNext.js` da yashaydi, darslarga `codemod-auto-next.mjs` bilan tarqatiladi; tekshiruv `smoke-arena.mjs` T1–T3. | jonli | grep:useAutoNext | DARS_ETALON.md:3064 |
| DE-158 | `JetBrains Mono` yozilgan har joyda ligatura o'chiriladi: `font-feature-settings: "liga" 0, "calt" 0`. | hamma | grep:JetBrains Mono (qoida bilan juft); `node scripts/codemod-ligatura.mjs --check` | DARS_ETALON.md:3069 F-0922-19 |
| DE-158.1 | `font-variant-ligatures` ishlatilmaydi, chunki `font-feature-settings` bilan birga kelganda Chrome qatorni tashlab ketadi. | hamma | grep:font-variant-ligatures | DARS_ETALON.md:3085 |
| DE-158.2 | Ligatura xossasi guruh-selektorga emas, har e'lonning o'z ichiga yoziladi. | hamma | ko'z | DARS_ETALON.md:3087 |
| DE-158.3 | Ildizdagi `font-feature-settings: "ss01","cv11"` ligaturani o'chirmaydi, shuning uchun yetarli emas. | hamma | grep:"ss01","cv11" | DARS_ETALON.md:3091 |
| DE-159.1 | Chap rang-chiziq yo'q: `border-left: 3–6px solid`, `border-left-color`, `box-shadow: inset 2–6px 0 0` taqiq; holat fon yoki to'liq halqa bilan beriladi. | hamma | grep:border-left:\s*[3-6]px solid\|inset [2-6]px 0 0 | DARS_ETALON.md:3108 F-0926-01 |
| DE-159.2 | Karta tepasidagi kesik bezak-chiziq (`repeating-linear-gradient`) yo'q; ma'no tashisa `/* kesik-ok: sabab */` izohi shart. | hamma | grep:repeating-linear-gradient | DARS_ETALON.md:3112 |
| DE-159.3 | Bo'sh-holat ramkasi («… bosing ←» `frame-dash`) yo'q; chorlov mentor gapida va tugmada beriladi. | hamma | grep:frame-dash | DARS_ETALON.md:3114 |
| DE-159.3b | Ramka olingach ⛶ (Zoomable) bo'sh ustun ustida yolg'iz qolmaydi: `.z-float` yoki `<Zoomable off={!active}>`; `page-audit` `ZBTN=0`. | hamma | ekran:`tools/page-audit.mjs` ZBTN | DARS_ETALON.md:3121 |
| DE-159.4 | Chip, karta va jihoz yorliqlari oldida `ico:`/`sIco`/`tIco` emoji-qatlam yo'q; RECAPS `ic:`, olam-matni va tizim-UI belgilari qoladi. | hamma | grep:\bico:\|sIco\|tIco\|-ico" | DARS_ETALON.md:3124 |
| DE-159.5 | Qora tugma yo'q: `.btn/.rc-btn/.lp-done-btn` `background: ${T.accent}; color: #fff`; `.mstats-reveal` paper/accent/1px accent, `:hover` va `.ready` da `color: #fff`. | hamma | grep:\.mstats-reveal | DARS_ETALON.md:3129 |
| DE-159.6 | Mentor aytgan gapni variant ostidagi kursiv qator takrorlamaydi; fleshkarta «bosing» yo'rig'i (`.fc-cue`, `.fc-hint`) faqat `InternetLesson` ning 1–3-kartasida. | hamma | grep:fc-cue\|fc-hint | DARS_ETALON.md:3131 |
| DE-159.7 | Bir sahifada bir ma'no bir marta aytiladi: mentor gapi qoladi, takror blok, sarlavha va yorliq ketadi. | PM | ko'z | DARS_ETALON.md:3136 |
| DE-159.8 | Maydon tepasida ham ichida ham yozuv bo'lmaydi: yorliq qisqa savol sifatida placeholder ichiga kiradi, `aria-label` to'liq savol. | PM | grep:placeholder= | DARS_ETALON.md:3141 |
| DE-159.9 | Bloklar tepasi bir chiziqda: ikki ustunda farq ≤2px, `justify-content: center`/`margin-top: auto` o'rniga `flex-start`; `.stq`/`.kdx` `align-items: flex-start`. | PM | ekran:`page-audit` ALIGN >6px | DARS_ETALON.md:3145 F-0926-05 |
| DE-159.10 | Baland rang yo'q: katta to'yingan fon o'rniga `…Soft` fon yoki `box-shadow: 0 0 0 2px rang` halqa. | hamma | ekran:`page-audit` LOUD | DARS_ETALON.md:3156 |
| DE-159.11 | Test izohi qisqa: natija yorlig'i tepada, izoh «To'g'ri —» bilan boshlanmaydi, variantni qaytarmaydi; mentor gapida «pastda», «chapda» yo'q. | PM | grep:To'g'ri — | DARS_ETALON.md:3158 |
| DE-159.12 | Javobdan keyingi holatda ham hech narsa tugmalar qatori orqasida qolmaydi, 1280x800 da; tekshiruv uz va ru (`--lang=ru`). | hamma | ekran:javobdan keyin 1280x800 uz/ru | DARS_ETALON.md:3163 |
| DE-159.13 | Karta balandligi ichidagiga mos bo'ladi; `flex-grow: 1`/`max-height` bilan ekranni to'ldirish va `margin-top: auto` bilan o'rtaga tushirish yo'q. | hamma | grep:margin-top:\s*auto | DARS_ETALON.md:3169 F-0926-05 |
| DE-159.14 | Holat bir marta aytiladi: «✓ Bajarildi» tugmasi ostida `done-mini` va `.kdpanel.is-done` takrori yo'q. | hamma | grep:done-mini\|kdpanel\.is-done | DARS_ETALON.md:3174 |
| DE-159.15 | Sudraladigan chip oq fon, `border: 2px solid accent`, accent matn va «⠿» ushlagich bilan; halqa `box-shadow` bilan berilmaydi (`tap-hint` uni o'chiradi). | hamma | ekran:sudraladigan chip | DARS_ETALON.md:3177 |
| DE-159.16 | Yonma-yon o'xshash qutilar pastki chekdan ham tekislanadi (`.split.eqh`, subgrid); biri 2× baland bo'lsa istisno; majburiy emas. | hamma | ekran:`page-audit` EQH | DARS_ETALON.md:3184 F-0926-06 |
| DE-159.17 | Savol ekranida tanlashdan oldin ko'rinadigan izoh yoki yozuv to'g'ri javobni aytmaydi. | hamma | ko'z | DARS_ETALON.md:3191 |
| DE-159.d | Har tahrirdan keyin `npm run lint:dizayn -- <fayl>` (D1 stripe, D2 kesik) va `lint:dark` 0 topilma bo'lishi shart. | hamma | grep:lint:dizayn | DARS_ETALON.md:3193 |
| DE-160.1 | Rasm, sxema yoki oyna o'z yorlig'i va izohi bilan bitta `.vis-card` ichida turadi (paper-fon, 16px radius, bitta soya, 12px gap). | hamma | grep:vis-card | DARS_ETALON.md:3197 F-0927-01 |
| DE-160.2 | Karta ichidagi vizual ikkinchi soya olmaydi, faqat `0 0 0 1px` chegara bilan. | hamma | ko'z | DARS_ETALON.md:3203 |
| DE-160.3 | Izohsiz ustun-yorlig'i (tagida izoh-matn yo'q) kartaga solinmaydi; qoida faqat izoh-matn bor joyda. | hamma | ko'z | DARS_ETALON.md:3205 |
| DE-160.4 | Boshqaruv elementlari (chip, tugma) `.vis-card` dan tashqarida qoladi. | hamma | ko'z | DARS_ETALON.md:3210 |
| DE-160.5 | `.vis-card` ustun tepasidan boshlanadi; qo'shni ustun bilan tekislik DE-159.9 bo'yicha qayta o'lchanadi. | hamma | ekran:`.vis-card` va qo'shni ustun tepasi | DARS_ETALON.md:3212 |
| DE-160.6 | O'lchov `page-audit --clicks=2` `LOOSE` bilan; javobdan keyingi izoh, nishon-sharti, tab-legenda va yutuq-medali qoidaga kirmaydi. | hamma | ekran:`page-audit` LOOSE | DARS_ETALON.md:3214 |
| DE-161.1 | Matn emojisiz ham to'liq tushunarli bo'ladi: emoji olib tashlansa ma'no o'zgarmaydi. | hamma | ko'z | DARS_ETALON.md:3225 F-0929-18 |
| DE-161.2 | Bir ekranda bir xil emoji bir marta; ichma-ich takror yo'q. | hamma | grep:lint:emoji (takror emoji warn) | DARS_ETALON.md:3226 |
| DE-161.3 | Mentor gapi, savol matni, test variantlari, xato-izohlar, kod va izohi, yakun ro'yxati, kartochkalarda emoji yo'q. | hamma | grep:lint:emoji | DARS_ETALON.md:3227 |
| DE-161.4 | Emoji faqat ekran eyebrow'ida yoki karta sarlavhasida ko'pi bilan bittadan; ro'yxat bandlari oldida raqam yoki oddiy belgi. | hamma | grep:lint:emoji | DARS_ETALON.md:3228 |
| DE-161.5 | Bir ekran yoki global blok (RECAPS, QUIZ_BANK, kartochka) ichida emoji jami 4 tadan oshmaydi; tugma-belgilar (▶ ✓ ←) sanalmaydi. | hamma | grep:lint:emoji | DARS_ETALON.md:3230 |
| DE-161.6 | Nishon va bayram ekranida ham emoji bitta; bu yagona istisno (≈DE-152). | tex | grep:lint:emoji | DARS_ETALON.md:3232 |
| DE-161.7 | `npm run lint:emoji -- <fayl>` `npm run gates` tarkibida; limit oshsa yoki test matnida emoji bo'lsa error, takror emoji warn. | hamma | grep:lint:emoji | DARS_ETALON.md:3233 |
