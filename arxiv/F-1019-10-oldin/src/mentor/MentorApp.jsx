import React, { useState, useEffect, useRef, Suspense } from 'react'
import { MODULES, ALL_LESSONS } from './lessons.jsx'

// ============================================================
//  MENTOR YUZASI — LMS ishlamay qolganda dars o'tiladigan zaxira sayt.
//  Uch qatlam: bosh sahifa (modullar) → modul sahifasi (darslar) → dars (to'liq ekran).
//  Dars ma'lumoti `lessons.jsx` da — u avto-yig'iladi (npm run gen:mentor).
//
//  Dizayn: fon yengil kulrang — shunda OQ kartalar ko'zga tashlanadi va qatlam seziladi.
//  Har modulning o'z rangi bor: raqam, sarlavha-tasma, hover-soyasi shu rangda.
//  Dars turi (Kod/PM/Proyekt) ham rang bilan ajraladi — mentor ro'yxatni bir qarashda o'qiydi.
// ============================================================

const T = {
  bg: '#F5F6F8', paper: '#FFFFFF', tint: '#F0F2F5',
  ink: '#0F1115', ink2: '#4B5162', ink3: '#8A90A2',
  line: '#E3E6EC', line2: '#EDEFF3',
  accent: '#E2451F', shadow: '15,17,21',
}

// Modul rangi: c — to'q (raqam, tasma), soft — yengil fon, glow — hover soyasi
const MOD_TONE = {
  m2: { c: '#DB4218', soft: '#FFF0EB', glow: '219,66,24', tag: 'HTML · CSS' },
  m3: { c: '#B57A00', soft: '#FFF6E2', glow: '181,122,0', tag: 'JavaScript' },
  m4: { c: '#0E7FB8', soft: '#E5F3FB', glow: '14,127,184', tag: 'React' },
  m5: { c: '#12805A', soft: '#E3F5EC', glow: '18,128,90', tag: 'Express · PostgreSQL' },
  m6: { c: '#6D3BE4', soft: '#EFEAFE', glow: '109,59,228', tag: 'NestJS · CI/CD' },
}

const CHIP = {
  Kod: { c: '#C13A12', bg: '#FFEDE6', t: { uz: 'Kod', ru: 'Код' } },
  PM: { c: '#5B33D6', bg: '#EFEAFE', t: { uz: 'PM', ru: 'PM' } },
  Proyekt: { c: '#0F7350', bg: '#E3F5EC', t: { uz: 'Proyekt', ru: 'Проект' } },
  Demo: { c: '#96650A', bg: '#FFF4DC', t: { uz: 'Demo', ru: 'Демо' } },
  Rezerv: { c: '#6E7383', bg: '#EFF1F4', t: { uz: 'Rezerv', ru: 'Резерв' } },
}

const UI = {
  brand: { uz: 'Mentor uchun', ru: 'Для ментора' },
  kicker: { uz: 'CoddyCamp · Senior 2026', ru: 'CoddyCamp · Senior 2026' },
  h1: { uz: 'Barcha darslar shu yerda', ru: 'Все уроки — здесь' },
  lead: {
    uz: "LMS ochilmay qolsa, darsni shu yerdan o'tasiz. Beshta modul, oxirgi versiya, o'zbekcha va ruscha.",
    ru: 'Если LMS не открывается — ведите урок отсюда. Пять модулей, последняя версия, на узбекском и русском.',
  },
  search: { uz: 'Dars qidirish…', ru: 'Поиск урока…' },
  found: { uz: 'topildi', ru: 'найдено' },
  nothing: { uz: 'Hech narsa topilmadi', ru: 'Ничего не найдено' },
  nothingSub: { uz: "Boshqa so'z bilan urinib ko'ring.", ru: 'Попробуйте другое слово.' },
  lessons: { uz: 'dars', ru: 'уроков' },
  secModules: { uz: 'Modullar', ru: 'Модули' },
  secLessons: { uz: 'Darslar', ru: 'Уроки' },
  soon: { uz: 'jonli dars', ru: 'живой урок' },
  open: { uz: 'Ochish', ru: 'Открыть' },
  back: { uz: 'Modullar', ru: 'Модули' },
  backLesson: { uz: "Darslar ro'yxatiga", ru: 'К списку уроков' },
  home: { uz: 'Bosh sahifa', ru: 'Главная' },
  loading: { uz: 'Dars yuklanmoqda…', ru: 'Урок загружается…' },
  next: { uz: 'Keyingi', ru: 'Следующий' },
  prev: { uz: 'Oldingi', ru: 'Предыдущий' },
  howto: { uz: 'Ish tartibi', ru: 'Порядок работы' },
  step1: { uz: 'Darsni oching', ru: 'Откройте урок' },
  step1s: { uz: "Jonli sessiya boshlaysiz — PIN chiqadi, LMS'dagidek.", ru: 'Запускаете живую сессию — появляется PIN, как в LMS.' },
  step2: { uz: 'Havolani guruhga tashlang', ru: 'Отправьте ссылку в группу' },
  step2s: { uz: 'Dars ichidagi nusxalash tugmasi havolani oladi.', ru: 'Кнопка копирования внутри урока берёт ссылку.' },
  step3: { uz: "O'quvchilar qo'shiladi", ru: 'Ученики подключаются' },
  step3s: { uz: 'Shu havoladan kirib, PIN bilan darsda qatnashadi.', ru: 'Заходят по ссылке и участвуют в уроке по PIN.' },
  copy: { uz: 'Dars havolasini nusxalash', ru: 'Скопировать ссылку на урок' },
  copied: { uz: 'Nusxalandi', ru: 'Скопировано' },
  foot: { uz: 'Zaxira yuzasi — LMS ishlamay qolgan payt uchun.', ru: 'Резервная площадка — на случай, когда LMS недоступна.' },
}

// ── Dars havolasi ──────────────────────────────────────────────────────────
// Ish oqimi (LMS'dagi bilan AYNAN bir xil): mentor darsni ochadi → jonli sessiya
// boshlaydi → PIN oladi → SHU HAVOLANI guruhga tashlaydi → o'quvchilar kirib PIN bilan
// qo'shiladi. Shuning uchun dars ochilishiga ARALASHMAYMIZ — jonli rejim buzilmasin.
const lessonUrl = (key) => `${window.location.origin}${window.location.pathname}#/l/${key}`

// Dars ekranida qobiq (Shell) chizilmaydi — suzuvchi panel uslubi shu komponentda.
const DockStyles = () => (
  <style>{`
    .mn-dock { position: fixed; bottom: 14px; left: 14px; z-index: 950; display: flex; align-items: center; gap: 6px; opacity: .5; transition: opacity .2s; font-family: 'Manrope', system-ui, sans-serif }
    .mn-dock:hover { opacity: 1 }
    .mn-dockbtn { width: 32px; height: 30px; border-radius: 8px; background: #fff; border: 1px solid ${T.line}; color: ${T.ink2}; display: grid; place-items: center; text-decoration: none; font-size: 15px; font-weight: 700; cursor: pointer; padding: 0; box-shadow: 0 2px 6px -3px rgba(${T.shadow},.25) }
    .mn-dockbtn:hover { color: ${T.accent}; border-color: ${T.accent} }
    .mn-dockbtn.is-done { color: #0F7350; border-color: #0F7350 }
    .mn-dock .mn-lang { display: flex; border-radius: 8px; background: #fff; overflow: hidden; border: 1px solid ${T.line}; box-shadow: 0 2px 6px -3px rgba(${T.shadow},.25) }
  `}</style>
)

const useRoute = () => {
  const read = () => decodeURIComponent(window.location.hash.replace(/^#\/?/, ''))
  const [r, setR] = useState(read)
  useEffect(() => {
    const on = () => setR(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return r
}

const Loading = ({ lang }) => (
  <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bg, fontFamily: "'Manrope', system-ui, sans-serif", color: T.ink2, fontWeight: 600 }}>
    {UI.loading[lang]}
  </div>
)

const LangSwitch = ({ lang, pick, size = 'md' }) => {
  const h = size === 'sm' ? 30 : 32
  const w = size === 'sm' ? 36 : 40
  return (
    <div className="mn-lang" style={{ height: h }}>
      {['uz', 'ru'].map((l) => (
        <button key={l} onClick={() => pick(l)} aria-pressed={lang === l}
          style={{ width: w, height: h, border: 'none', cursor: 'pointer', fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 700, fontSize: 11.5, letterSpacing: '0.06em', background: lang === l ? T.accent : 'transparent', color: lang === l ? '#fff' : T.ink2, transition: 'background .15s, color .15s' }}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

// Havolani nusxalash — mentor uni guruhga tashlaydi, o'quvchilar shu yerdan PIN bilan kiradi.
const CopyLink = ({ k, lang }) => {
  const [done, setDone] = useState(false)
  const copy = async () => {
    const url = lessonUrl(k)
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // clipboard yopiq bo'lsa (eski brauzer / http) — eski usul bilan
      const ta = document.createElement('textarea')
      ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(ta)
    }
    setDone(true)
    setTimeout(() => setDone(false), 1600)
  }
  return (
    <button type="button" className={`mn-dockbtn${done ? ' is-done' : ''}`} onClick={copy}
      title={done ? UI.copied[lang] : UI.copy[lang]} aria-label={UI.copy[lang]}>
      {done ? '✓' : '⧉'}
    </button>
  )
}

const LessonCard = ({ l, lang, modLabel, i }) => {
  const ch = CHIP[l.type] || CHIP.Kod
  const inner = (
    <>
      <span className="lc-n" style={{ background: ch.bg, color: ch.c }}>{String(l.n).padStart(2, '0')}</span>
      <span className="lc-e">{l.emoji}</span>
      <span className="lc-body">
        <span className="lc-t">{l.title[lang]}</span>
        <span className="lc-s">{l.sub[lang]}</span>
      </span>
      {modLabel && <span className="lc-mod">{modLabel}</span>}
      <span className="lc-type" style={{ background: ch.bg, color: ch.c }}>{ch.t[lang]}</span>
      {l.comp
        ? <span className="lc-go" aria-hidden="true">&rarr;</span>
        : <span className="lc-soon">{UI.soon[lang]}</span>}
    </>
  )
  const style = { '--tone': ch.c, animationDelay: `${Math.min(i, 14) * 22}ms` }
  return l.comp
    ? <a className="lc" href={`#/l/${l.key}`} style={style}>{inner}</a>
    : <div className="lc is-soon" style={style}>{inner}</div>
}

const SectionHead = ({ children, right }) => (
  <div className="sec">
    <h2 className="sec-h">{children}</h2>
    {right && <span className="sec-r">{right}</span>}
  </div>
)

export default function MentorApp() {
  const route = useRoute()
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('cc_lang') === 'ru' ? 'ru' : 'uz' } catch { return 'uz' }
  })
  const pickLang = (l) => { setLang(l); try { localStorage.setItem('cc_lang', l) } catch {} }
  const [q, setQ] = useState('')
  const searchRef = useRef(null)

  useEffect(() => { window.scrollTo(0, 0) }, [route])

  // «/» — qidiruvga sakrash (mentor shoshib turganda qo'l klaviaturadan uzilmasin)
  useEffect(() => {
    const on = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') { e.preventDefault(); searchRef.current?.focus() }
      if (e.key === 'Escape' && document.activeElement === searchRef.current) { setQ(''); searchRef.current.blur() }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])

  // ── DARS ───────────────────────────────────────────────────────────────────
  if (route.startsWith('l/')) {
    const key = route.slice(2)
    const lesson = ALL_LESSONS.find((l) => l.key === key && l.comp)
    if (lesson) {
      const C = lesson.comp
      return (
        <Suspense fallback={<Loading lang={lang} />}>
          <DockStyles />
          <C lang={lang} />
          <div className="mn-dock">
            <a href="#/" className="mn-dockbtn" title={UI.home[lang]} aria-label={UI.home[lang]}>&#8962;</a>
            <a href={`#/${lesson.moduleId}`} className="mn-dockbtn" title={UI.backLesson[lang]} aria-label={UI.backLesson[lang]}>&#8592;</a>
            <CopyLink k={lesson.key} lang={lang} />
            <LangSwitch lang={lang} pick={pickLang} size="sm" />
          </div>
        </Suspense>
      )
    }
  }

  // ── MODUL SAHIFASI ─────────────────────────────────────────────────────────
  const mod = MODULES.find((m) => m.id === route)
  if (mod) {
    const tone = MOD_TONE[mod.id]
    const idx = MODULES.indexOf(mod)
    const prev = MODULES[idx - 1]
    const next = MODULES[idx + 1]
    const cnt = mod.lessons.filter((l) => l.comp).length
    const num = mod.label[lang].replace(/\D+/g, '').padStart(2, '0')
    const short = (m) => m.heading[lang].replace(/^\d+[^—]*—\s*/, '')
    return (
      <Shell lang={lang} pickLang={pickLang}>
        <div className="wrap">
          <a className="crumb" href="#/">&#8592; {UI.back[lang]}</a>
          <header className="mhead" style={{ '--tone': tone.c, '--soft': tone.soft, '--glow': tone.glow }}>
            <span className="mhead-n">{num}</span>
            <div style={{ minWidth: 0 }}>
              <p className="mhead-tag">{tone.tag}</p>
              <h1 className="mhead-t">{short(mod)}</h1>
              <p className="mhead-l">{mod.lead[lang]}</p>
            </div>
          </header>
          <SectionHead right={`${cnt} ${UI.lessons[lang]}`}>{UI.secLessons[lang]}</SectionHead>
          <div className="lc-list">
            {mod.lessons.map((l, i) => <LessonCard key={l.key} l={l} lang={lang} i={i} />)}
          </div>
          <nav className="modnav">
            {prev
              ? <a className="modnav-b" href={`#/${prev.id}`} style={{ '--tone': MOD_TONE[prev.id].c }}><span>&#8592; {UI.prev[lang]}</span><b>{short(prev)}</b></a>
              : <span />}
            {next
              ? <a className="modnav-b is-next" href={`#/${next.id}`} style={{ '--tone': MOD_TONE[next.id].c }}><span>{UI.next[lang]} &rarr;</span><b>{short(next)}</b></a>
              : <span />}
          </nav>
        </div>
      </Shell>
    )
  }

  // ── BOSH SAHIFA ────────────────────────────────────────────────────────────
  const needle = q.trim().toLowerCase()
  const hits = needle
    ? ALL_LESSONS.filter((l) => l.comp && (
        l.title[lang].toLowerCase().includes(needle) ||
        l.sub[lang].toLowerCase().includes(needle) ||
        (l.title[lang === 'uz' ? 'ru' : 'uz'] || '').toLowerCase().includes(needle)))
    : []

  return (
    <Shell lang={lang} pickLang={pickLang}>
      <div className="wrap">
        <section className="hero">
          <p className="hero-k">{UI.kicker[lang]}</p>
          <h1 className="hero-h">{UI.h1[lang]}</h1>
          <p className="hero-l">{UI.lead[lang]}</p>
          <div className="sbox">
            <span className="sbox-i" aria-hidden="true">&#9906;</span>
            <input ref={searchRef} className="sbox-in" type="search" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={UI.search[lang]} aria-label={UI.search[lang]} />
            <kbd className="sbox-k">/</kbd>
          </div>
        </section>

        {needle ? (
          <>
            <SectionHead right={`${hits.length} ${UI.found[lang]}`}>{UI.secLessons[lang]}</SectionHead>
            {hits.length === 0
              ? <div className="empty"><b>{UI.nothing[lang]}</b><span>{UI.nothingSub[lang]}</span></div>
              : <div className="lc-list">
                  {hits.map((l, i) => {
                    const m = MODULES.find((x) => x.id === l.moduleId)
                    return <LessonCard key={l.key} l={l} lang={lang} i={i} modLabel={m.label[lang]} />
                  })}
                </div>}
          </>
        ) : (
          <>
            <SectionHead>{UI.secModules[lang]}</SectionHead>
            <div className="mgrid">
              {MODULES.map((m, i) => {
                const tone = MOD_TONE[m.id]
                const cnt = m.lessons.filter((l) => l.comp).length
                const num = m.label[lang].replace(/\D+/g, '').padStart(2, '0')
                return (
                  <a key={m.id} className="mcard" href={`#/${m.id}`}
                    style={{ '--tone': tone.c, '--soft': tone.soft, '--glow': tone.glow, animationDelay: `${i * 45}ms` }}>
                    <span className="mcard-top">
                      <span className="mcard-n">{num}</span>
                      <span className="mcard-tag">{tone.tag}</span>
                    </span>
                    <span className="mcard-body">
                      <span className="mcard-t">{m.heading[lang].replace(/^\d+[^—]*—\s*/, '')}</span>
                      <span className="mcard-l">{m.lead[lang]}</span>
                    </span>
                    <span className="mcard-foot">
                      <span className="mcard-c">{cnt} {UI.lessons[lang]}</span>
                      <span className="mcard-go">{UI.open[lang]} &rarr;</span>
                    </span>
                  </a>
                )
              })}
            </div>

            <section className="how">
              <SectionHead>{UI.howto[lang]}</SectionHead>
              <ol className="how-l">
                {[[UI.step1, UI.step1s], [UI.step2, UI.step2s], [UI.step3, UI.step3s]].map(([t, s], i) => (
                  <li key={i}>
                    <b>{t[lang]}</b>
                    <span>{s[lang]}</span>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
      </div>
    </Shell>
  )
}

// ── Umumiy qobiq: sarlavha-panel + uslub ─────────────────────────────────────
function Shell({ lang, pickLang, children }) {
  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Manrope:wght@500;600;700;800&display=swap');
        * { box-sizing: border-box }
        .root { min-height: 100dvh; background: ${T.bg}; font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; -webkit-font-smoothing: antialiased }
        .wrap { max-width: 940px; margin: 0 auto; padding: 0 22px 96px }
        @keyframes rise { from { opacity: 0; transform: translateY(9px) } to { opacity: 1; transform: none } }

        /* sarlavha-panel */
        .top { position: sticky; top: 0; z-index: 40; background: rgba(245,246,248,.86); backdrop-filter: blur(12px); border-bottom: 1px solid ${T.line} }
        .top-in { max-width: 940px; margin: 0 auto; padding: 12px 22px; display: flex; align-items: center; gap: 11px }
        .logo { display: flex; align-items: center; gap: 8px; text-decoration: none; color: ${T.ink} }
        .logo-m { width: 24px; height: 24px; border-radius: 7px; background: ${T.accent}; display: grid; place-items: center; color: #fff; font-weight: 800; font-size: 12px; box-shadow: 0 3px 9px -3px rgba(226,69,31,.6) }
        .logo b { font-size: 14.5px; font-weight: 800; letter-spacing: -0.01em }
        .top-sep { width: 1px; height: 15px; background: ${T.line} }
        .top-role { font-size: 12.5px; font-weight: 600; color: ${T.ink2} }
        .mn-lang { display: flex; border-radius: 8px; overflow: hidden; border: 1px solid ${T.line}; background: ${T.paper} }

        /* hero */
        .hero { padding: 42px 0 30px }
        .hero-k { margin: 0 0 10px; font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: ${T.accent} }
        .hero-h { margin: 0 0 11px; font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: clamp(30px,4.8vw,44px); line-height: 1.1; letter-spacing: -0.015em }
        .hero-l { margin: 0 0 22px; font-size: 15px; font-weight: 500; color: ${T.ink2}; max-width: 610px; line-height: 1.6 }

        /* qidiruv */
        .sbox { position: relative; display: flex; align-items: center; max-width: 430px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 11px; padding: 0 12px; box-shadow: 0 2px 6px -4px rgba(${T.shadow},.2); transition: border-color .15s, box-shadow .15s }
        .sbox:focus-within { border-color: ${T.accent}; box-shadow: 0 0 0 3px rgba(226,69,31,.12) }
        .sbox-i { color: ${T.ink3}; font-size: 14px; transform: rotate(-45deg) }
        .sbox-in { flex: 1; border: none; outline: none; background: transparent; font-family: inherit; font-size: 14.5px; font-weight: 600; color: ${T.ink}; padding: 12px 10px }
        .sbox-in::placeholder { color: ${T.ink3}; font-weight: 500 }
        .sbox-k { font-family: inherit; font-size: 10.5px; font-weight: 700; color: ${T.ink3}; border: 1px solid ${T.line}; border-radius: 5px; padding: 1px 6px; background: ${T.tint} }

        /* bo'lim sarlavhasi */
        .sec { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin: 34px 0 14px; padding-bottom: 8px; border-bottom: 2px solid ${T.ink} }
        .sec-h { margin: 0; font-size: 11.5px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase }
        .sec-r { font-size: 11.5px; font-weight: 700; color: ${T.ink3}; letter-spacing: .04em; text-transform: uppercase }

        /* modul kartalari */
        .mgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 14px }
        .mcard { display: flex; flex-direction: column; text-decoration: none; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 15px; overflow: hidden; box-shadow: 0 2px 8px -5px rgba(${T.shadow},.25); animation: rise .42s cubic-bezier(.2,.7,.3,1) both; transition: transform .2s, box-shadow .2s, border-color .2s }
        .mcard:hover { transform: translateY(-4px); border-color: var(--tone); box-shadow: 0 20px 34px -22px rgba(var(--glow),.7), 0 3px 10px -6px rgba(${T.shadow},.2) }
        .mcard:hover .mcard-go { gap: 8px }
        .mcard-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 15px 18px; background: var(--soft); border-bottom: 1px solid ${T.line2} }
        .mcard-n { font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: 30px; line-height: 1; color: var(--tone); letter-spacing: -0.02em }
        .mcard-tag { font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--tone); opacity: .85; text-align: right }
        .mcard-body { flex: 1; padding: 15px 18px 12px }
        .mcard-t { display: block; font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: 19.5px; line-height: 1.25; margin-bottom: 7px }
        .mcard-l { display: block; font-size: 12.8px; font-weight: 500; color: ${T.ink2}; line-height: 1.5 }
        .mcard-foot { display: flex; align-items: center; justify-content: space-between; padding: 11px 18px 14px; border-top: 1px solid ${T.line2}; font-size: 12.5px; font-weight: 700 }
        .mcard-c { color: ${T.ink3} }
        .mcard-go { display: inline-flex; align-items: center; gap: 5px; color: var(--tone); font-weight: 800; transition: gap .18s }

        /* dars kartalari */
        .lc-list { display: flex; flex-direction: column; gap: 8px }
        .lc { display: grid; grid-template-columns: 34px 24px 1fr auto auto 18px; align-items: center; gap: 13px; text-decoration: none; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-left: 3px solid var(--tone); border-radius: 11px; padding: 12px 15px; box-shadow: 0 2px 7px -5px rgba(${T.shadow},.25); animation: rise .34s cubic-bezier(.2,.7,.3,1) both; transition: transform .16s, box-shadow .16s, border-color .16s }
        .lc:hover { transform: translateX(4px); box-shadow: 0 12px 22px -16px rgba(${T.shadow},.5) }
        .lc:hover .lc-go { color: var(--tone); transform: translateX(3px) }
        .lc.is-soon { background: transparent; box-shadow: none; border-style: dashed; border-left-color: ${T.line}; opacity: .72 }
        .lc.is-soon:hover { transform: none; box-shadow: none }
        .lc-n { height: 26px; border-radius: 7px; display: grid; place-items: center; font-size: 11.5px; font-weight: 800; font-variant-numeric: tabular-nums }
        .lc-e { font-size: 19px; line-height: 1; text-align: center }
        .lc-body { min-width: 0 }
        .lc-t { display: block; font-size: 14.5px; font-weight: 800; line-height: 1.3; margin-bottom: 2px }
        .lc-s { display: block; font-size: 12.5px; font-weight: 500; color: ${T.ink2}; line-height: 1.4 }
        .lc-mod { font-size: 10.5px; font-weight: 700; color: ${T.ink2}; background: ${T.tint}; padding: 3px 8px; border-radius: 99px; white-space: nowrap }
        .lc-type { font-size: 10.5px; font-weight: 800; padding: 3px 9px; border-radius: 99px; white-space: nowrap; letter-spacing: .02em }
        .lc-go { color: ${T.ink3}; font-size: 16px; text-align: right; transition: color .16s, transform .16s }
        .lc-soon { font-size: 10.5px; font-weight: 700; color: ${T.ink3}; white-space: nowrap }

        /* modul sahifasi boshi */
        .crumb { display: inline-block; text-decoration: none; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; margin: 24px 0 14px; transition: color .15s }
        .crumb:hover { color: ${T.accent} }
        .mhead { display: flex; gap: 18px; align-items: flex-start; background: ${T.paper}; border: 1px solid ${T.line}; border-left: 4px solid var(--tone); border-radius: 15px; padding: 20px 22px; box-shadow: 0 3px 12px -8px rgba(var(--glow),.5) }
        .mhead-n { flex-shrink: 0; width: 54px; height: 54px; border-radius: 13px; background: var(--soft); color: var(--tone); display: grid; place-items: center; font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: 26px; letter-spacing: -0.02em }
        .mhead-tag { margin: 2px 0 4px; font-size: 10.5px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--tone) }
        .mhead-t { margin: 0 0 7px; font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: clamp(21px,3.4vw,29px); line-height: 1.2; letter-spacing: -0.01em }
        .mhead-l { margin: 0; font-size: 13.5px; font-weight: 500; color: ${T.ink2}; line-height: 1.55; max-width: 610px }

        /* ish tartibi */
        .how-l { list-style: none; counter-reset: s; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(215px,1fr)); gap: 12px }
        .how-l li { counter-increment: s; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 15px 16px }
        .how-l li::before { content: counter(s, decimal-leading-zero); display: grid; place-items: center; width: 24px; height: 24px; border-radius: 7px; background: ${T.tint}; font-family: 'Source Serif 4', Georgia, serif; font-size: 12.5px; color: ${T.ink2}; margin-bottom: 8px }
        .how-l b { display: block; font-size: 14px; font-weight: 800; margin-bottom: 3px }
        .how-l span { display: block; font-size: 12.5px; font-weight: 500; color: ${T.ink2}; line-height: 1.5 }

        /* natija yo'q */
        .empty { background: ${T.paper}; border: 1px dashed ${T.line}; border-radius: 13px; padding: 34px; text-align: center; display: flex; flex-direction: column; gap: 5px }
        .empty b { font-size: 15px; font-weight: 800 }
        .empty span { font-size: 13px; color: ${T.ink2}; font-weight: 500 }

        /* modul navigatsiyasi */
        .modnav { display: flex; justify-content: space-between; gap: 14px; margin: 26px 0 0 }
        .modnav-b { display: flex; flex-direction: column; gap: 3px; text-decoration: none; color: ${T.ink}; max-width: 47%; padding: 13px 16px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; transition: border-color .16s, transform .16s }
        .modnav-b:hover { border-color: var(--tone); transform: translateY(-2px) }
        .modnav-b span { font-size: 10.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink3} }
        .modnav-b b { font-size: 13.5px; font-weight: 800 }
        .modnav-b.is-next { margin-left: auto; text-align: right }

        .foot { border-top: 1px solid ${T.line} }
        .foot-in { max-width: 940px; margin: 0 auto; padding: 20px 22px 30px; font-size: 12px; color: ${T.ink3}; font-weight: 500; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap }

        @media (max-width: 640px) {
          .lc { grid-template-columns: 30px 1fr 18px; gap: 10px; padding: 11px 12px }
          .lc-e, .lc-type, .lc-mod { display: none }
          .sbox-k { display: none }
          .modnav-b { max-width: 100% }
          .mhead { padding: 16px }
        }
        @media (prefers-reduced-motion: reduce) {
          .mcard, .lc, .modnav-b, .lc-go, .mcard-go { animation: none !important; transition: none }
          .mcard:hover, .lc:hover, .modnav-b:hover { transform: none }
        }
      `}</style>
      <div className="top">
        <div className="top-in">
          <a className="logo" href="#/">
            <span className="logo-m">C</span>
            <b>CoddyCamp</b>
          </a>
          <span className="top-sep" />
          <span className="top-role">{UI.brand[lang]}</span>
          <span style={{ flex: 1 }} />
          <LangSwitch lang={lang} pick={pickLang} />
        </div>
      </div>
      {children}
      <footer className="foot">
        <div className="foot-in">
          <span>{UI.foot[lang]}</span>
          <span>CoddyCamp &middot; Senior 2026</span>
        </div>
      </footer>
    </div>
  )
}
