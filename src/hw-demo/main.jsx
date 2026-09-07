// UYGA VAZIFA DEMO — PM uy vazifalari ko'rik-sayti (coddycamp-uyga-vazifa).
// Maqsad: LMS'ga ulashdan oldin jonli ko'rib-sinash. LMS'da bu qobiq YO'Q — til LMS'dan keladi.
// F-0828-06 saqlanadi: SAHIFADA vazifa-tanlov tugmasi yo'q — vazifa faqat ?hw=<id> URL-parametri
// bilan tanlanadi (har vazifaning o'z havolasi bor, foydalanuvchi birma-bir ko'rib chiqadi).
// DEMO-SEED: dars-artefakti brauzerda bo'lmasa, namunaviy dars-javoblari yoziladi — o'quvchi
// darsdan keyin ko'radigan avto-to'lish demo'da ham ko'rinsin. LMS'da seed YO'Q (dars o'zi yozadi).
// ↺ tugmasi: shu vazifaning saqlovi + seed-kalitlarini o'chirib, boshidan boshlaydi (faqat demo).
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import PmLesson1Homework from '../1-Modull/PmLesson1.homework.jsx';
import PmLesson2Homework from '../1-Modull/PmLesson2.homework.jsx';
import PmLesson3Homework from '../1-Modull/PmLesson3.homework.jsx';
import PmLesson4Homework from '../2-Modull/PmLesson4.homework.jsx';
import PmLesson5Homework from '../2-Modull/PmLesson5.homework.jsx';
import PmLesson6Homework from '../2-Modull/PmLesson6.homework.jsx';
import PmUserStoryHomework from '../pm/PmUserStoryLesson.homework.jsx';
import PmLesson8Homework from '../3-Modull/PmLesson8.homework.jsx';
import PmLesson9Homework from '../3-Modull/PmLesson9.homework.jsx';
import PmLesson10Homework from '../3-Modull/PmLesson10.homework.jsx';
import PmLesson11Homework from '../4-Modull/PmLesson11.homework.jsx';
import PmLesson12Homework from '../4-Modull/PmLesson12.homework.jsx';
import PmLesson13Homework from '../4-Modull/PmLesson13.homework.jsx';
import PmLesson14Homework from '../4-Modull/PmLesson14.homework.jsx';
import PmLesson15Homework from '../4a-Modull/PmLesson15.homework.jsx';
import PmLesson16Homework from '../4b-Modull/PmLesson16.homework.jsx';
import PmLesson17Homework from '../4c-Modull/PmLesson17.homework.jsx';
import PmLesson18Homework from '../4c-Modull/PmLesson18.homework.jsx';

// Har vazifa: id (URL uchun) · komponent · seed (dars-artefakti namunasi, faqat demo).
const REGISTRY = [
  { id: 'pm-m1-02', C: PmLesson1Homework, seed: {
    'pm-m1d2-cards': [{ kim: "Maktab yonidagi novvoyxona egasi", muammo: "Narxlarni har kuni telefonda aytib charchaydi", yechim: "Narxlar sahifasi bor sayt" }],
  } },
  { id: 'pm-m1-06', C: PmLesson2Homework, seed: null },
  { id: 'pm-m1-14', C: PmLesson3Homework, seed: {
    ccPitch3: { kim: "Maktab yonidagi novvoyxona uchun sayt qildim", muammo: "Odamlar narxni bilish uchun har safar kirib chiqardi", yechim: "Endi narxlar sahifada — telefondan bir qarashda ko'rinadi", link: '' },
  } },
  { id: 'pm-m2-02', C: PmLesson4Homework, seed: {
    'pm-m2d2-features': [
      { qiyinchilik: "Buyurtmani telefon qilib berish kerak", imkoniyat: "Saytdan buyurtma tugmasi" },
      { qiyinchilik: "Qaysi non qolgani noma'lum", imkoniyat: "Qoldiq ro'yxati sahifasi" },
      { qiyinchilik: "Ish vaqtini bilishmaydi", imkoniyat: "Ish vaqti va manzil bo'limi" },
    ],
  } },
  { id: 'pm-m2-07', C: PmLesson5Homework, seed: {
    'pm-m2d7-mvp': { v1: ["Narxlar ro'yxati", "Buyurtma tugmasi", "Ish vaqti va manzil"] },
  } },
  { id: 'pm-m2-13', C: PmLesson6Homework, seed: {
    'pm-m2d13-pitch': { kim: "maktab yonidagi novvoyxona mijozlari uchun", muammo: "narxni bilish uchun har safar do'konga kirish kerak edi", qiladi: "sayt narxlar va qoldiqni telefonda ko'rsatadi" },
  } },
  { id: 'pm-m3-02', C: PmUserStoryHomework, seed: {
    'pm-m3d2-stories': [
      { kim: "Kechqurun band o'quvchi", nima: "darslikni telefonda ochish", natija: "yo'lda ham o'qiy oladi" },
      { kim: "Yangi kelgan o'quvchi", nima: "o'tilgan mavzular ro'yxatini ko'rish", natija: "qayerdan boshlashni biladi" },
      { kim: "Ota-ona", nima: "farzandining natijasini ko'rish", natija: "qanday o'qiyotganini biladi" },
    ],
    'pm-m3d2-hw-target': 'dost',
  } },
  { id: 'pm-m3-05', C: PmLesson8Homework, seed: {
    'pm-m3d5-board': { items: [
      { nom: "Savatchani eslab qolish", katak: 'darrov' },
      { nom: "Qorong'i rejim", katak: 'reja' },
      { nom: "Ovozli qidiruv", katak: 'keyin' },
    ] },
  } },
  { id: 'pm-m3-10', C: PmLesson9Homework, seed: {
    'pm-m3d10-shartlar': { ish: "«Yozilish» tugmasi", shartlar: [
      "Ism yozilsa, ro'yxatga tushadi va «Yozildingiz» chiqadi",
      "Bo'sh yuborilsa «Ismingizni yozing» xabari chiqadi",
      "Tugma 2 marta bosilsa ro'yxatda bitta yozuv qoladi",
    ] },
  } },
  { id: 'pm-m3-14', C: PmLesson10Homework, seed: {
    'pm-m3d14-pitch': { ish: "«Yozilish» tugmasi", kadrlar: [
      { gap: "Ilgari odamlar yozilish uchun qo'ng'iroq qilardi", harakat: "Sahifani ochaman" },
      { gap: "Endi ismni yozib bosishning o'zi yetadi", harakat: "Ismni yozib «Yozilish»ni bosaman" },
      { gap: "Ism darhol ro'yxatda ko'rinadi", harakat: "Ro'yxatni ko'rsataman" },
    ] },
  } },
  { id: 'pm-m4-02', C: PmLesson11Homework, seed: {
    'pm-m4d2-data': { maydonlar: [
      { maydon: "Ism", bolim: "Yozilganlar ro'yxati" },
      { maydon: "Tanlangan kun", bolim: "Bo'sh soatlar jadvali" },
      { maydon: "Telefon raqami", bolim: "Buyurtma sahifasi" },
    ] },
  } },
  { id: 'pm-m4-07', C: PmLesson12Homework, seed: {
    'pm-m4d7-ishonch': { qatorlar: [
      { maydon: "Ism", ruxsat: 'ochiq', sabab: "kirgan odam ro'yxatda kimlar borini ko'radi" },
      { maydon: "Telefon raqami", ruxsat: 'yopiq', sabab: "begona odam ko'rsa, qo'ng'iroq qilib bezovta qiladi" },
      { maydon: "Parol", ruxsat: 'yopiq', sabab: "ko'rgan odam hisobga kirib oladi" },
    ] },
  } },
  { id: 'pm-m4-12', C: PmLesson13Homework, seed: {
    'pm-m4d12-sxema': { ustunlar: [
      { nom: "ism", savol: "ro'yxatda kim borligini ko'rsatish uchun", kim: 'ochiq' },
      { nom: "telefon", savol: "buyurtma haqida odamga xabar berish uchun", kim: 'yopiq' },
      { nom: "sana", savol: "qaysi kunga yozilganini eslab qolish uchun", kim: 'ochiq' },
    ] },
  } },
  { id: 'pm-m4-15', C: PmLesson14Homework, seed: {
    'pm-m4d15-pitch': { qavatlar: [
      { gap: "Sahifa bo'sh joylarni ko'rsatadi va bosishni qabul qiladi" },
      { gap: "Server joy chindan bo'shligini tekshiradi" },
      { gap: "Baza kim qaysi joyni olganini eslab qoladi" },
    ] },
  } },
  { id: 'pm-m4a-02', C: PmLesson15Homework, seed: {
    'pm-m4a2-yuk': { qarorlar: [
      { qism: "O'rindiq tanlash", qaror: 'kuchaytiramiz', sabab: "ochilish daqiqasida hamma birdan bosadi" },
      { qism: "To'lov", qaror: 'kuchaytiramiz', sabab: "hamma bir vaqtda to'laydi" },
      { qism: "E'lon sahifasi", qaror: 'oddiy', sabab: "odamlar bitta-bitta o'qiydi, shoshilish yo'q" },
    ] },
  } },
  { id: 'pm-m4b-02', C: PmLesson16Homework, seed: {
    'pm-m4b2-sifat': { kartalar: [
      { nima: "«Boshlash»ni bosdim — «Xatolik» chiqdi, skuter ochilmadi", kimda: 'hammada', oqibat: 'toxtaydi' },
      { nima: "Tilni o'zbekchaga o'tkazdim — har ochganda yana ruscha bo'lib qoladi", kimda: 'bazilarda', oqibat: 'noqulay' },
      { nima: "Kechqurun xaritani ochdim — skuterlar ko'rinmaydi", kimda: 'bazilarda', oqibat: 'toxtaydi' },
    ] },
  } },
  { id: 'pm-m4c-02', C: PmLesson17Homework, seed: {
    'pm-m4c2-reliz': { bolaklar: [
      { hafta: 1, ish: "«Yozilish» tugmasi — bossa, ism ro'yxatga tushadi" },
      { hafta: 2, ish: "E'lonni ulashish havolasi — bossa, havola nusxalanadi" },
      { hafta: 3, ish: "«Mening e'lonlarim» ro'yxati — bossa, o'z e'lonlarini ko'radi" },
    ] },
  } },
  { id: 'pm-m4c-06', C: PmLesson18Homework, seed: {
    'pm-m4c6-signal': { signallar: [
      { olchov: 'ochilish', chegara: 5, sabab: "5 daqiqa ochilmasa kirgan odam xato ko'radi" },
      { olchov: 'vaqt', chegara: 3, sabab: "3 soniyada odam kutmay yopib ketadi" },
      { olchov: 'xato', chegara: 5, sabab: "100 dan 5 tasi xato bo'lsa kirganlar sezadi" },
    ] },
  } },
];

const params = new URLSearchParams(location.search);
const entry = REGISTRY.find(r => r.id === (params.get('hw') || '').trim()) || REGISTRY.find(r => r.id === 'pm-m1-06');

// Demo-seed: dars-artefakti yo'q bo'lsa, namunani yozamiz (render'dan OLDIN — komponent o'qib olsin).
// Satr-qiymat aynan, qolgani JSON bo'lib yoziladi; mavjud kalitga TEGILMAYDI.
try {
  if (entry.seed) {
    for (const [k, v] of Object.entries(entry.seed)) {
      if (!localStorage.getItem(k)) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
    }
  }
} catch {}

function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('hwDemoLang') || 'uz'; } catch { return 'uz'; }
  });
  const pick = (l) => { setLang(l); try { localStorage.setItem('hwDemoLang', l); } catch {} };
  const reset = () => {
    try {
      localStorage.removeItem(`ccHomework:${entry.id}`);
      if (entry.seed) for (const k of Object.keys(entry.seed)) localStorage.removeItem(k);
    } catch {}
    location.reload();
  };
  const btn = (l) => ({
    fontFamily: 'Manrope, sans-serif', fontWeight: lang === l ? 800 : 600, fontSize: 11,
    border: 'none', borderRadius: 7, padding: '4px 8px', cursor: 'pointer',
    background: lang === l ? '#5B3DE6' : '#EBE5FD', color: lang === l ? '#fff' : '#5B3DE6',
  });
  const HW = entry.C;
  return (
    <div>
      {/* F-0827-29: demo-boshqaruv «UYGA VAZIFA» yorlig'i OSTIDA, xira (soya kabi) — hover'da tiniq. LMS'da bu qobiq yo'q. */}
      <style>{'.hw-lang{position:fixed;top:56px;left:28px;z-index:9999;display:flex;gap:4px;padding:3px;border-radius:9px;background:#F2F0FA;opacity:.28;transition:opacity .2s}.hw-lang:hover,.hw-lang:focus-within{opacity:1}@media (hover:none){.hw-lang{opacity:.5}}@media (max-width:640px){.hw-lang{top:auto;bottom:72px;left:8px}}'}</style>
      <div className="hw-lang">
        <button style={btn('uz')} onClick={() => pick('uz')}>UZ</button>
        <button style={btn('ru')} onClick={() => pick('ru')}>RU</button>
        <button style={{ ...btn('x'), fontWeight: 600 }} title="Boshidan boshlash (demo)" onClick={reset}>↺</button>
      </div>
      <HW key={lang + entry.id} lang={lang} onFinished={(p) => console.log('HW_FINISHED', JSON.stringify(p))} />
    </div>
  );
}
createRoot(document.getElementById('root')).render(<App />);
