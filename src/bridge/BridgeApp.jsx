import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'
import { PATHS, LESSONS, loaderFor } from './lessons.js'

// ============================================================
//  O'TISH DARSLARI — bosh sahifa (4 o'tish yo'li) → yo'l sahifasi (darslar) → dars (to'liq ekran).
//  Rang — PM-STUDIA pasporti (PM_DARS_ETALON 1-bo'lim): indigo, studio-qog'oz fon, oq kartalar.
// ============================================================
const T = {
  bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4', paper: '#FFFFFF',
  accent: '#5B3DE6', accentSoft: '#EBE5FD', line: '#E7E3F4', success: '#12A968', shadow: '40, 34, 82',
}
const PATH_TONE = { p1: '#B57A00', p2: '#0E7FB8', p3: '#12805A', p4: '#5B3DE6' }
const UI = {
  kicker: { uz: 'CoddyCamp · AI Startup', ru: 'CoddyCamp · AI Startup' },
  h1: { uz: "O'tish darslari", ru: 'Уроки перехода' },
  lead: {
    uz: "AI Startup dasturiga o'rtadan qo'shilgan o'quvchi uchun PM darslari. O'z yo'lingizni tanlang — darslar tartib bilan ketadi.",
    ru: 'PM-уроки для ученика, который присоединился к программе AI Startup с середины. Выберите свой путь — уроки идут по порядку.',
  },
  path: { uz: "o'tish", ru: 'переход' },
  lessonsN: { uz: 'dars', ru: 'урок(а)' },
  lesson: { uz: 'dars', ru: 'урок' },
  back: { uz: "O'tish yo'llari", ru: 'Пути перехода' },
  backLesson: { uz: 'Darslar', ru: 'Уроки' },
  soon: { uz: 'Tayyorlanmoqda', ru: 'Готовится' },
  loading: { uz: 'Dars yuklanmoqda…', ru: 'Урок загружается…' },
}
const tr = (o, lang) => (o && typeof o === 'object' ? (o[lang] ?? o.uz) : o)
// Har o'tishning o'z manzili (25.09): coddycamp-bridge.vercel.app/2 → bosh sahifada faqat 2-o'tish kartasi.
// Manzil (pathname) hash-navigatsiyada o'zgarmaydi — darsdan «← Darslar» bilan qaytganda ham filtr saqlanadi.
// Ildiz «/» — to'rt o'tish. Boshqa o'tishning hash-manzili (#/p3/… /2 da) bosh sahifaga qaytaradi.
const ONLY = (() => { const m = window.location.pathname.match(/^\/([1-9])\/?$/); const id = m && `p${m[1]}`; return id && PATHS.find(x => x.id === id) ? id : null })()
const VISIBLE = ONLY ? PATHS.filter(x => x.id === ONLY) : PATHS
const readHash = () => {
  const [p, l] = (window.location.hash || '').replace(/^#\/?/, '').split('/')
  const ok = VISIBLE.find(x => x.id === p)
  return { p: ok ? p : null, l: ok && l && LESSONS[l] ? l : null }
}
const lazyCache = {}
const lessonComp = (key) => {
  const loader = loaderFor(LESSONS[key].file)
  if (!loader) return null
  if (!lazyCache[key]) lazyCache[key] = lazy(loader)
  return lazyCache[key]
}

export default function BridgeApp() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('bridgeLang') === 'ru' ? 'ru' : 'uz' } catch { return 'uz' } })
  const [route, setRoute] = useState(readHash)
  useEffect(() => { const f = () => setRoute(readHash()); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f) }, [])
  useEffect(() => { try { localStorage.setItem('bridgeLang', lang) } catch { /* jim */ } document.documentElement.lang = lang }, [lang])
  const go = (p, l) => { window.location.hash = p ? `/${p}${l ? `/${l}` : ''}` : '' }
  const path = PATHS.find(x => x.id === route.p)

  if (path && route.l) {
    const Comp = lessonComp(route.l)
    return (
      <div style={{ minHeight: '100vh', background: T.bg }}>
        <TopBar lang={lang} setLang={setLang} onBack={() => go(path.id)} backLabel={tr(UI.backLesson, lang)} />
        {Comp ? (
          <Suspense fallback={<div style={{ padding: 60, textAlign: 'center', color: T.ink2, fontFamily: 'Manrope, sans-serif' }}>{tr(UI.loading, lang)}</div>}>
            <Comp key={`${route.l}-${lang}`} lang={lang} />
          </Suspense>
        ) : <Soon lang={lang} />}
      </div>
    )
  }
  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: 'Manrope, system-ui, sans-serif', color: T.ink }}>
      <style>{FONTS}</style>
      <TopBar lang={lang} setLang={setLang} onBack={path ? () => go(null) : null} backLabel={tr(UI.back, lang)} />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 80px' }}>
        {!path ? (
          <>
            <div style={{ fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: T.accent, fontWeight: 700 }}>{tr(UI.kicker, lang)}</div>
            <h1 style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontSize: 'clamp(30px, 5vw, 44px)', margin: '8px 0 10px' }}>{tr(UI.h1, lang)}</h1>
            <p style={{ color: T.ink2, fontSize: 17, maxWidth: 640, lineHeight: 1.55, margin: '0 0 28px' }}>{tr(UI.lead, lang)}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {VISIBLE.map(p => (
                <button key={p.id} onClick={() => go(p.id)} className="br-card" style={{ ...card, borderTop: `4px solid ${PATH_TONE[p.id]}` }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 34, fontWeight: 700, color: PATH_TONE[p.id] }}>{p.n}</div>
                  <div style={{ fontSize: 13, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.06em' }}>{p.n}-{tr(UI.path, lang)}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, margin: '4px 0 8px' }}>{p.tag}</div>
                  <div style={{ color: T.ink2, fontSize: 14 }}>{p.lessons.length} {tr(UI.lessonsN, lang)}</div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: PATH_TONE[path.id], fontWeight: 700 }}>{path.n}-{tr(UI.path, lang)} · {path.tag}</div>
            <h1 style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontSize: 'clamp(28px, 4.5vw, 40px)', margin: '8px 0 24px' }}>{path.tag}</h1>
            <div style={{ display: 'grid', gap: 12 }}>
              {path.lessons.map((key, i) => {
                const L = LESSONS[key]; const ready = !!loaderFor(L.file)
                return (
                  <button key={key} onClick={() => ready && go(path.id, key)} disabled={!ready} className="br-card" style={{ ...card, display: 'flex', alignItems: 'center', gap: 18, opacity: ready ? 1 : 0.6, cursor: ready ? 'pointer' : 'default' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: T.accentSoft, color: T.accent, display: 'grid', placeItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 18, flex: '0 0 auto' }}>{i + 1}</div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ fontSize: 13, color: T.ink3 }}>{i + 1}-{tr(UI.lesson, lang)} · {tr(L.ip, lang)}</div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{tr(L.title, lang)}</div>
                    </div>
                    {!ready && <span style={{ fontSize: 12, color: T.ink3 }}>{tr(UI.soon, lang)}</span>}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

const card = {
  background: T.paper, border: `1px solid ${T.line}`, borderRadius: 16, padding: '20px 22px', textAlign: 'left',
  boxShadow: `0 6px 20px rgba(${T.shadow}, .07)`, cursor: 'pointer', font: 'inherit', color: T.ink,
  transition: 'transform .18s ease, box-shadow .18s ease',
}
const FONTS = [
  "@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700&family=Manrope:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');",
  ".br-card:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 12px 28px rgba(40,34,82,.13)}",
  "@media (prefers-reduced-motion: reduce){.br-card{transition:none}.br-card:hover{transform:none}}",
].join('\n')

function TopBar({ lang, setLang, onBack, backLabel }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(242,240,250,.92)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${T.line}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Manrope, sans-serif' }}>
        {onBack && <button onClick={onBack} style={chip}>← {backLabel}</button>}
        <div style={{ flex: 1 }} />
        {['uz', 'ru'].map(l => (
          <button key={l} onClick={() => setLang(l)} style={{ ...chip, background: lang === l ? T.accent : T.paper, color: lang === l ? '#fff' : T.ink2 }}>{l.toUpperCase()}</button>
        ))}
      </div>
    </div>
  )
}
const chip = { border: `1px solid ${T.line}`, background: T.paper, color: T.ink2, borderRadius: 999, padding: '6px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }

function Soon({ lang }) {
  return <div style={{ padding: 80, textAlign: 'center', color: T.ink2, fontFamily: 'Manrope, sans-serif' }}>{tr(UI.soon, lang)}</div>
}
