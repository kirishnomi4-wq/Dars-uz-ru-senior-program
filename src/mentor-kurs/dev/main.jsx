// Dev-harness (faqat lokal): darsni platformadagi kabi mount qiladi — { studentName, lang, onFinished }.
// URL: /mentor-kurs.html?dars=nest-01&s=5&lang=ru  (s — darsni N-ekranda ochish, faqat dev; lang — uz | ru)
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const DARSLAR = {
  'nest-01': () => import('../NestArchMentorLesson.jsx'),
  'nest-02': () => import('../NestRepoMentorLesson.jsx'),
  'pg-01': () => import('../PgIntroMentorLesson.jsx'),
  'pg-02': () => import('../PgCrudMentorLesson.jsx'),
  'jest-01': () => import('../JestUnitMentorLesson.jsx'),
  'jest-02': () => import('../JestEdgeMentorLesson.jsx'),
  'cicd-01': () => import('../CiCdIntroMentorLesson.jsx'),
  'cicd-02': () => import('../GithubActionsMentorLesson.jsx'),
  'tgpg-01': () => import('../TgPgMentorLesson.jsx'),
  'ws1-01': () => import('../WsBasicsMentorLesson.jsx'),
  'ws2-01': () => import('../WsReconnectMentorLesson.jsx'),
  'wh-01': () => import('../WebhookMentorLesson.jsx'),
};

// Bosh sahifa (03.11, ko'rik sayti): ?dars= bo'lmasa — 12 dars ro'yxati. 04.11: til tanlash (?lang=ru) — RU tayyor darslar `ru: true` (05.11: 12/12)
const ROYXAT = [
  ['pg-01', 'PostgreSQL-1', "Siz bilgan Mongo'dan PostgreSQL jadvallariga", 'От знакомой Mongo к таблицам PostgreSQL', true],
  ['pg-02', 'PostgreSQL-2', "CRUD so'rovlar va Express'dan bazaga", 'CRUD-запросы и из Express в базу', true],
  ['nest-01', 'NestJS-1', 'NestJS arxitekturasi: Module, Controller, Service', 'Архитектура NestJS: Module, Controller, Service', true],
  ['nest-02', 'NestJS-2', "O'quvchi reposi: bitta resurs, Guard va sinfdagi xatolar", 'Репозиторий ученика: один ресурс, Guard и ошибки в классе', true],
  ['tgpg-01', 'Telegraf + PostgreSQL', "Buyurtma boti: AI bilan bazaga ko'chiramiz", 'Бот заказов: переносим в базу вместе с AI', true],
  ['jest-01', 'Jest-1', "OrderBotNest'ga birinchi testlar", 'Первые тесты для OrderBotNest', true],
  ['jest-02', 'Jest-2', "Xato yo'li: bot noto'g'ri kirishda to'g'ri buziladimi", 'Путь ошибки: правильно ли бот ломается на неверном вводе', true],
  ['cicd-01', 'CI/CD-1', "Lenta: OrderBotNest'ning testlari har push'da o'zi yuradi", 'Конвейер: тесты OrderBotNest запускаются сами при каждом push', true],
  ['cicd-02', 'CI/CD-2', "GitHub Actions ichida: qizil run'dan PR'gacha", 'Внутри GitHub Actions: от красного run до PR', true],
  ['ws1-01', 'WebSocket-1', "Jonli panel: server o'zi xabar yuboradi", 'Живая панель: сервер сам присылает сообщение', true],
  ['ws2-01', 'WebSocket-2', 'Ulanish uzilsa: buzamiz va tuzatamiz', 'Если соединение оборвалось: ломаем и чиним', true],
  ['wh-01', 'Webhook', "To'lov xabari: imzo, takror va rad", 'Сообщение об оплате: подпись, повтор и отказ', true],
];
function Royxat() {
  const ruL = new URLSearchParams(location.search).get('lang') === 'ru';
  const L = (uz, ru) => (ruL ? ru : uz);
  const tab = (on, href, txt) => <a href={href} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid #E5E7EB', background: on ? '#111827' : '#fff', color: on ? '#fff' : '#111827', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>{txt}</a>;
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 16px', fontFamily: 'Inter, system-ui, sans-serif', color: '#111827' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600 }}>{L('CoddyCamp · Mentor kursi', 'CoddyCamp · Курс для менторов')}</div>
        <div style={{ display: 'flex', gap: 6 }}>{tab(!ruL, '?', "O'zbekcha")}{tab(ruL, '?lang=ru', 'Русский')}</div>
      </div>
      <h1 style={{ fontSize: 28, margin: '6px 0 6px' }}>{L('Mentor darslari', 'Уроки для менторов')}</h1>
      <p style={{ margin: '0 0 22px', color: '#4B5563', lineHeight: 1.5 }}>{L("Har dars ovozli: ovoz tugagach «Davom» ochiladi. Ovoz uchun kompyuterda ovoz yoqilgan bo'lsin.", 'Каждый урок озвучен: «Далее» откроется, когда учитель договорит. Включите звук на компьютере.')}</p>
      <div style={{ display: 'grid', gap: 10 }}>
        {ROYXAT.map(([k, n, t, tr, ready]) => (
          <a key={k} href={`?dars=${k}${ruL ? '&lang=ru' : ''}`} style={{ display: 'block', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '14px 16px', textDecoration: 'none', color: 'inherit', opacity: ruL && !ready ? 0.6 : 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{n}{ruL && !ready && <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: '#B45309' }}>перевод в работе — пока на узбекском</span>}</div>
            <div style={{ color: '#4B5563', fontSize: 14, marginTop: 2 }}>{ruL ? tr : t}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function Harness() {
  const q = new URLSearchParams(location.search);
  const key = q.get('dars');
  const startAt = q.get('s') != null ? Number(q.get('s')) : undefined;
  const lang = q.get('lang') === 'ru' ? 'ru' : 'uz'; // F-1030-38: ?lang=ru
  const [Comp, setComp] = useState(null);
  const [err, setErr] = useState('');
  const [payload, setPayload] = useState(null);
  useEffect(() => {
    if (!key) return;
    const load = DARSLAR[key];
    if (!load) { setErr(`dars yo'q: ${key}`); return; }
    load().then((m) => setComp(() => m.default)).catch((e) => setErr(String(e && e.message || e)));
  }, [key]);
  if (!key) return <Royxat />;
  if (err) return <pre style={{ padding: 20, color: '#b00' }}>{err}</pre>;
  if (!Comp) return <div style={{ padding: 20, fontFamily: 'monospace' }}>yuklanmoqda…</div>;
  // F-1105-01: dars ichida til tugmasi — o'sha darsni boshqa tilda qayta ochadi (platformada tilni LMS beradi, bu faqat ko'rik sayti uchun)
  const href = (l) => { const u = new URLSearchParams(location.search); if (l === 'ru') u.set('lang', 'ru'); else u.delete('lang'); return '?' + u.toString(); };
  const pill = (on, l, txt) => <a href={href(l)} aria-current={on ? 'true' : undefined} style={{ padding: '4px 10px', borderRadius: 999, textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: '.02em', background: on ? '#111827' : 'transparent', color: on ? '#fff' : '#111827' }}>{txt}</a>;
  return (
    <>
      <div className="mk-langbar" style={{ position: 'fixed', top: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 10000, display: 'flex', alignItems: 'center', gap: 2, padding: 3, borderRadius: 999, background: 'rgba(255,255,255,.92)', border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,.08)', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <a href={lang === 'ru' ? '?lang=ru' : '?'} title={lang === 'ru' ? 'Все уроки' : 'Hamma darslar'} style={{ padding: '4px 8px', fontSize: 12, fontWeight: 600, color: '#4B5563', textDecoration: 'none' }}>{lang === 'ru' ? '← Уроки' : '← Darslar'}</a>
        {pill(lang === 'uz', 'uz', 'UZ')}{pill(lang === 'ru', 'ru', 'RU')}
      </div>
      <Comp studentName="Mentor" lang={lang} startAt={startAt} onFinished={(p) => { window.__onFinished = p; setPayload(p); }} />
      {payload && <pre style={{ position: 'fixed', bottom: 8, left: 8, zIndex: 9999, maxWidth: 420, maxHeight: 180, overflow: 'auto', background: '#111', color: '#9f9', font: '11px/1.4 monospace', padding: 8, borderRadius: 6 }}>onFinished ✓ {JSON.stringify(payload, null, 1)}</pre>}
    </>
  );
}
createRoot(document.getElementById('root')).render(<Harness />);
