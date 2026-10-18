// ============================================================================
// QOLIP · CSS (D1 ekran turlari · D2 ikki tugma · D3 to'qqiz token · D4 emojisiz yuza)
// Dars uni o'z <style> blokiga qo'shadi: {qolipCss(T)}. Barcha klasslar «q-» bilan boshlanadi —
// darsning eski klasslari bilan to'qnashmaydi. CSS izohida teskari tirnoq (backtick) yozilmaydi.
// ============================================================================
import { fon } from './tokens.js';

export const qolipCss = (Q) => `
  /* --- Ekran: tepadan boshlanadi, bloklar orasida bir xil oraliq (174) --- */
  .q-ekran { display: flex; flex-direction: column; gap: clamp(12px,1.8vw,16px); min-width: 0; }
  .q-split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(14px,2.4vw,24px); align-items: stretch; min-width: 0; }
  .q-split.q-keng-ong { grid-template-columns: minmax(0,0.85fr) minmax(0,1.15fr); }
  .q-col { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
  .q-col > .q-karta:last-child, .q-col > .q-vizual-karta:last-child { flex-grow: 1; }
  /* ⛶ qobig'i (zoomable) ichidagi vizual ham ustun balandligini to'ldiradi — ikki ustun bir balandlikda */
  .q-split > .q-col > .zoomable:last-child { flex-grow: 1; display: flex; flex-direction: column; }
  .q-split > .q-col > .zoomable:last-child > :not(.zoom-btn):last-child { flex-grow: 1; }
  @media (max-width: 860px) {
    .q-split, .q-split.q-keng-ong { grid-template-columns: minmax(0,1fr); }
    .q-split.q-vizual-avval > .q-col:last-child { order: -1; } /* telefonda vizual tepada — bosish va o'zgarish bir ko'rishda */
  }

  /* --- Karta: oq + 1px chiziq. Soya va ichki ramka yo'q (QA: minimalist) --- */
  .q-karta { background: ${Q.paper}; border: 1px solid ${Q.line}; border-radius: 14px; padding: clamp(12px,1.8vw,16px); display: flex; flex-direction: column; gap: 10px; min-width: 0; }
  .q-yorliq { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${Q.ink2}; }

  /* --- D2: tugma ikki darajada. Asosiy — to'la rang, ekranda bitta; ikkinchi darajali — chegarali. O'ng chetda (187) --- */
  .q-btn { align-self: flex-end; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13.5px,1.5vw,14.5px); line-height: 1.2; cursor: pointer; border: 1.5px solid ${Q.accent}; border-radius: 11px; padding: 10px 18px; background: ${Q.accent}; color: #fff; transition: filter 0.15s, opacity 0.15s; }
  .q-btn:hover:not(:disabled) { filter: brightness(1.06); }
  .q-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .q-btn.q-2 { background: ${Q.paper}; color: ${Q.ink}; border-color: ${Q.line}; }
  .q-btn.q-2:hover:not(:disabled) { border-color: ${Q.accent}; color: ${Q.accent}; filter: none; }
  .q-btn.q-2:disabled { opacity: 1; border-color: transparent; background: none; color: ${Q.ink2}; font-weight: 600; font-size: 13px; padding: 6px 4px; } /* bajarilgan ikkinchi daraja — oddiy izoh-matn («✓ Ochildi») */
  .q-btn:focus-visible, .q-chip:focus-visible { outline: 2px solid ${Q.accent}; outline-offset: 2px; }

  /* --- Kirish standarti (DE-201): radio-variant — texnik darslardagi hook-option bilan bir xil --- */
  .q-variantlar-kol { gap: 9px; }
  .q-variant { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${Q.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${Q.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${Q.shadowBase || '58, 53, 48'},0.12); }
  .q-variant:hover:not(:disabled):not(.on) { box-shadow: 0 10px 22px -6px rgba(${Q.shadowBase || '58, 53, 48'},0.18); }
  .q-variant.on { background: ${Q.accentSoft}; color: ${Q.accent}; box-shadow: 0 8px 22px -6px ${fon(Q.accent, 0.3)}, inset 0 0 0 1.5px ${Q.accent}; }
  .q-variant:disabled { cursor: default; }
  .q-radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${Q.ink2}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
  .q-variant.on .q-radio { box-shadow: inset 0 0 0 2px ${Q.accent}; }
  .q-radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${Q.accent}; }
  /* --- Reja standarti (DE-201): «01 · matn · teg» qadam-kartalari --- */
  .q-reja-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .q-reja-k { display: flex; align-items: center; gap: 14px; background: ${Q.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${Q.shadowBase || '58, 53, 48'},0.12); }
  .q-reja-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: ${Q.accent}; flex-shrink: 0; }
  .q-reja-b { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .q-reja-t { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(14px,1.6vw,15.5px); color: ${Q.ink}; }
  .q-reja-teg { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${Q.ink2}; background: ${Q.bg}; padding: 3px 8px; border-radius: 6px; }
  /* --- DE-199: ish tugadi — natija butun enga chiqadi va bir lahza kattalashib e'tiborni tortadi --- */
  .q-fokus { animation: q-fokus 0.62s cubic-bezier(.2,.9,.3,1.15) both; }
  .q-fokus > * { border-radius: 14px; }
  @keyframes q-fokus { 0% { opacity: 0.4; transform: scale(0.96); } 60% { opacity: 1; transform: scale(1.012); } 100% { transform: scale(1); } }
  /* --- Tanlov-chip: holat rangi faqat holatda --- */
  .q-chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.45vw,14px); line-height: 1.35; text-align: left; color: ${Q.ink}; background: ${Q.paper}; border: 1.5px solid ${Q.line}; border-radius: 11px; padding: 9px 13px; cursor: pointer; min-width: 0; overflow-wrap: anywhere; transition: border-color 0.15s, background 0.15s; }
  .q-chip:hover:not(:disabled) { border-color: ${Q.accent}; }
  .q-chip:disabled { cursor: default; }
  .q-chip.on { border-color: ${Q.accent}; background: ${Q.accentSoft}; }
  .q-chip.ok { border-color: ${Q.ok}; background: ${Q.okFon}; color: ${Q.ok}; }
  .q-chip.err { border-color: ${Q.err}; background: ${Q.errFon}; color: ${Q.err}; }
  .q-chip.q-silk { animation: q-silk 0.32s ease-in-out; }
  @keyframes q-silk { 0%, 100% { transform: none; } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
  .q-variantlar { display: flex; flex-wrap: wrap; gap: 8px; }

  /* --- Bashorat (181): ballsiz, bitta savol, tanlov saqlanadi --- */
  .q-bashorat { display: flex; flex-direction: column; gap: 9px; }
  .q-bashorat-s { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.6vw,15.5px); color: ${Q.ink}; line-height: 1.4; }
  p.q-taxmin, .q-taxmin { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; color: ${Q.ink2}; }
  .q-taxmin b { color: ${Q.ink}; }
  .q-taxmin.ok b { color: ${Q.ok}; }

  /* --- Qadamlar (163.8): o'tgani belgili, joriysi aksent --- */
  .q-qadamlar { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
  .q-qadamlar li { display: flex; align-items: center; gap: 9px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; color: ${Q.ink2}; line-height: 1.35; min-width: 0; }
  .q-qadamlar li i { font-style: normal; flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; border: 1.5px solid ${Q.line}; color: ${Q.ink2}; background: ${Q.paper}; }
  .q-qadamlar li.done { color: ${Q.ink}; }
  .q-qadamlar li.done i { background: ${Q.ok}; border-color: ${Q.ok}; color: #fff; }
  .q-qadamlar li.cur { color: ${Q.ink}; font-weight: 800; }
  .q-qadamlar li.cur i { border-color: ${Q.accent}; color: ${Q.accent}; }

  /* --- Xulosa (162): bitta, 110 belgigacha. Xato qatori: 60 belgigacha. «p.» — dars p-reset qoidasidan kuchliroq bo'lsin --- */
  p.q-xulosa, .q-xulosa { margin: 0; background: ${Q.okFon}; color: ${Q.ink}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.6vw,15.5px); line-height: 1.5; animation: q-kir 0.3s ease-out; } /* 202: texnik darslardagi .frame-success bilan AYNAN bir yashil */
  p.q-xato, .q-xato { margin: 0; color: ${Q.err}; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; line-height: 1.4; animation: q-kir 0.25s ease-out; }
  p.q-izoh, .q-izoh { margin: 0; color: ${Q.ink2}; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; line-height: 1.45; }
  @keyframes q-kir { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }

  /* --- Bosiladigan joy halqasi (168) --- */
  .q-halqa { position: relative; }
  .q-halqa::after { content: ''; position: absolute; inset: -4px; border-radius: inherit; border: 2px solid ${Q.accent}; opacity: 0; animation: q-halqa 1.6s ease-out infinite; pointer-events: none; }
  @keyframes q-halqa { 0% { opacity: 0.7; transform: scale(0.97); } 100% { opacity: 0; transform: scale(1.06); } }

  /* --- Test (DE-203): texnik darslar standarti — oq variant, A–D harfi; to'g'ri — yashil (202), tanlangan xato — modul rangi, qolgani xira --- */
  .q-test { gap: clamp(16px,2.5vw,24px); }
  .q-test-ogoh { margin: -8px 0 0; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; color: ${Q.accent}; }
  .q-test-ro { display: flex; flex-direction: column; gap: 11px; }
  .q-test-ro.ixcham { gap: 8px; }
  .q-test-v { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; background: ${Q.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(15px,1.85vw,17px); line-height: 1.45; color: ${Q.ink}; cursor: pointer; transition: all 0.2s; box-shadow: 0 6px 16px -6px rgba(${Q.shadowBase || '58, 53, 48'},0.14); }
  .q-test-ro.ixcham .q-test-v { padding: clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px); }
  .q-test-v:hover:not(:disabled) { box-shadow: 0 10px 22px -6px rgba(${Q.shadowBase || '58, 53, 48'},0.22); }
  .q-test-v:disabled { cursor: default; }
  .q-test-harf { min-width: 20px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${Q.ink2}; }
  .q-test-t { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .q-test-v.ok { background: ${Q.okFon}; color: ${Q.ok}; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32); }
  .q-test-v.ok .q-test-harf { color: ${Q.ok}; font-weight: 800; }
  .q-test-v.xira { color: ${Q.ink2}; opacity: 0.55; box-shadow: 0 4px 12px -6px rgba(${Q.shadowBase || '58, 53, 48'},0.08); }
  .q-test-v.xato { background: ${Q.accentSoft}; color: ${Q.accent}; opacity: 1; box-shadow: 0 8px 22px -6px ${fon(Q.accent, 0.38)}; }
  .q-test-v.kutish { background: ${Q.accentSoft}; color: ${Q.accent}; box-shadow: inset 0 0 0 2px ${Q.accent}, 0 8px 22px -8px ${fon(Q.accent, 0.3)}; animation: q-kutish 2s ease-in-out infinite; }
  @keyframes q-kutish { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.012); } }
  .q-test-javob { border-radius: 12px; padding: clamp(14px,2.5vw,20px); animation: q-kir 0.35s ease-out; }
  .q-test-javob.ok { background: ${Q.okFon}; box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
  .q-test-javob.qayta, .q-test-javob.kutish { background: ${Q.accentSoft}; box-shadow: 0 6px 16px -6px ${fon(Q.accent, 0.22)}; }
  p.q-test-js { margin: 0 0 6px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: ${Q.accent}; }
  .q-test-javob.ok p.q-test-js { color: ${Q.ok}; }
  .q-test-jm { font-family: 'Manrope', sans-serif; font-size: clamp(14px,1.6vw,15.5px); line-height: 1.55; color: ${Q.ink}; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
  .q-test-jm p { margin: 0; }
  /* --- Tartib-mashqi (188): uyalar chapda, bo'laklar o'ngda; to'g'ri — yashil to'lqin, xato — silkinish --- */
  .q-dd { display: grid; grid-template-columns: minmax(0,1.15fr) minmax(0,1fr); gap: 13px; align-items: start; }
  .q-dd > .q-xulosa, .q-dd > .q-xato { grid-column: 1 / -1; }
  @media (max-width: 760px) { .q-dd { grid-template-columns: minmax(0,1fr); } }
  .q-dd-slots { display: flex; flex-direction: column; gap: 9px; }
  .q-dd-slot { display: flex; align-items: center; gap: 12px; min-height: 58px; border-radius: 14px; border: 2px dashed ${fon(Q.ink2, 0.4)}; background: ${Q.paper}; padding: 8px 12px; transition: border-color .18s, background .18s; }
  .q-dd-slot.filled { border-style: solid; border-color: ${Q.line}; }
  .q-dd-slot.ok { border-color: ${Q.ok}; background: ${Q.okFon}; animation: q-dd-ok 0.42s cubic-bezier(.3,1.5,.5,1); }
  .q-dd-slot.ok:nth-child(2) { animation-delay: 0.07s; } .q-dd-slot.ok:nth-child(3) { animation-delay: 0.14s; } .q-dd-slot.ok:nth-child(4) { animation-delay: 0.21s; } .q-dd-slot.ok:nth-child(5) { animation-delay: 0.28s; }
  @keyframes q-dd-ok { 0%, 100% { transform: scale(1); } 45% { transform: scale(1.025); } }
  .q-dd-slot.bad { border-color: ${Q.err}; background: ${Q.errFon}; animation: q-silk .4s; }
  .q-dd-n { width: 26px; height: 26px; border-radius: 8px; background: ${Q.bg}; color: ${Q.ink2}; font-family: 'Manrope'; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: inset 0 0 0 1.5px ${Q.line}; }
  .q-dd-slot.ok .q-dd-n { background: ${Q.ok}; color: #fff; box-shadow: none; }
  .q-dd-slot.bad .q-dd-n { background: ${Q.err}; color: #fff; box-shadow: none; }
  .q-dd-hint { flex: 1; min-width: 0; color: ${Q.ink2}; font-family: 'Manrope'; font-style: italic; font-size: 13px; line-height: 1.35; }
  .q-dd-slot .q-dd-chip { min-width: 168px; text-align: left; }
  .q-dd-pool { display: flex; flex-wrap: wrap; gap: 9px; min-height: 48px; padding: 10px; border-radius: 14px; background: ${Q.bg}; position: relative; z-index: 1; }
  .q-dd-chip { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: ${Q.accent}; border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; user-select: none; box-shadow: 0 8px 16px -8px ${fon(Q.accent, 0.6)}, inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; }
  .q-dd-chip:hover { transform: translateY(-2px); }
  .q-dd-chip:active { cursor: grabbing; }
  .q-dd-chip.in { animation: q-dd-snap 0.32s cubic-bezier(.3,1.6,.5,1); }
  @keyframes q-dd-snap { 0% { transform: scale(1.14) rotate(-2deg); } 55% { transform: scale(0.97) rotate(0.5deg); } 100% { transform: scale(1) rotate(0); } }
  /* --- Kod ekrani (190/F-1004-35): chap vazifa, o'ng muharrir, bir balandlikda --- */
  .q-kod > .q-col > .q-karta, .q-kod > .q-col > .q-muharrir { flex-grow: 1; }
  .q-kod .q-karta > .q-btn { margin-top: auto; }

  /* --- Mustaqil ish: bitta ustun --- */
  .q-mustaqil { max-width: 640px; width: 100%; }
  /* --- Amaliyot bloki (172/173, QBlok): qadamlar bittadan, bajarilgani bir qatorga yig'iladi; o'ngda kutilgan natija --- */
  .q-blok-qadamlar { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .q-blok-q { display: flex; align-items: center; gap: 11px; background: ${Q.paper}; border: 1px solid ${Q.line}; border-radius: 12px; padding: 10px 13px; min-width: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); color: ${Q.ink}; }
  .q-blok-q.joriy { align-items: flex-start; border-color: ${Q.ink2}; }
  .q-blok-q.bajarildi { background: ${Q.okFon}; border-color: ${fon(Q.ok, 0.35)}; padding-block: 8px; }
  .q-blok-n { width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; background: ${Q.bg}; color: ${Q.ink2}; border: 1.5px solid ${Q.line}; }
  .q-blok-q.bajarildi .q-blok-n { background: ${Q.ok}; border-color: ${Q.ok}; color: #fff; }
  .q-blok-h { flex: 1; min-width: 0; font-weight: 700; color: ${Q.ok}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .q-blok-qaytar { flex-shrink: 0; border: none; background: transparent; color: ${Q.ok}; font-size: 16px; font-weight: 700; cursor: pointer; padding: 2px 6px; border-radius: 8px; }
  .q-blok-qaytar:hover { background: ${Q.paper}; }
  .q-blok-tana { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 10px; }
  p.q-blok-t { margin: 0; line-height: 1.5; overflow-wrap: break-word; }
  p.q-blok-xato { margin: 0; font-size: 12.5px; line-height: 1.45; color: ${Q.ink2}; }
  .q-blok-tugadi { background: ${Q.okFon}; border-radius: 12px; padding: clamp(12px,2vw,16px); }
  .q-blok-tugadi p { margin: 0; color: ${Q.ink}; line-height: 1.5; }
  .q-blok-natija { display: flex; flex-direction: column; min-width: 0; }
  .q-blok-ortda { display: flex; flex-direction: column; gap: 4px; font-size: 12px; line-height: 1.5; color: ${Q.ink2}; min-width: 0; }
  .q-blok-buyruq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${Q.ink}; background: ${Q.bg}; border: 1px solid ${Q.line}; border-radius: 6px; padding: 3px 7px; display: block; white-space: nowrap; overflow-x: auto; } /* buyruq bo'linmaydi (--tags), tor ekranda ichida suriladi */
  .q-prompt { width: 100%; background: ${Q.bg}; border: 1px solid ${Q.line}; border-radius: 11px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; }
  .q-prompt-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 3px; }
  .q-prompt-kim { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 10.5px; letter-spacing: 0.06em; color: ${Q.ink2}; }
  .q-prompt-nusxa { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; padding: 5px 11px; border-radius: 8px; border: 1px solid ${Q.line}; background: ${Q.paper}; color: ${Q.accent}; cursor: pointer; margin-left: auto; }
  .q-prompt-nusxa:hover { background: ${Q.accentSoft}; }
  p.q-prompt-satr { margin: 0; font-size: clamp(12.5px,1.5vw,13.5px); line-height: 1.55; color: ${Q.ink}; font-weight: 500; overflow-wrap: break-word; }
  .q-joy { background: ${Q.accentSoft}; color: ${Q.accent}; border-radius: 6px; padding: 1px 6px; font-weight: 700; }

  /* --- Voqea: karta mazmun balandligida (F-1004-44) --- */
  .q-voqea { align-items: center; text-align: center; }

  /* --- 8. Kartochkalar (DE-204): texnik darslar standarti aynan — pilotdan ko'chirildi, darsda nusxa yo'q (q21) --- */
  .fc-center { flex: 1; min-height: 0; display: flex; align-items: flex-start; justify-content: center; padding-top: 4px; } /* 174: kontent tepadan (texnik darslarda o'rtada edi — 6-Modul savolsiz tuzatish) */
  .fc { display: flex; flex-direction: column; gap: 11px; max-width: 520px; width: 100%; }
  .fc-top { display: flex; justify-content: space-between; align-items: center; }
  .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
  .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
  .fc-pill.learn { background: ${Q.accentSoft}; color: ${Q.accent}; border: 1.5px solid ${Q.accent}44; }
  .fc-pill.knew { background: ${Q.okFon}; color: ${Q.ok}; border: 1.5px solid ${Q.ok}44; }
  @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
  .fc-bar { height: 7px; background: ${Q.line}; border-radius: 99px; overflow: hidden; }
  .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, #FF8A3D, ${Q.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
  .fc-cardwrap { perspective: 1200px; position: relative; }
  .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${Q.paper}; border: 2px solid ${Q.line}; z-index: -1; }
  .fc-cardwrap::before { transform: translateY(7px) scale(0.965); opacity: 0.7; }
  .fc-cardwrap::after { transform: translateY(15px) scale(0.93); opacity: 0.4; }
  .fc-fly { position: relative; animation: fc-in 0.3s ease; }
  @keyframes fc-in { from { opacity: 0; transform: translateY(10px) scale(0.97); } }
  .fc-fly.out-knew { animation: fc-out-knew 0.42s ease forwards; }
  .fc-fly.out-again { animation: fc-out-again 0.42s ease forwards; }
  @keyframes fc-out-knew { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(70%) rotate(5deg); opacity: 0; } }
  @keyframes fc-out-again { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(-70%) rotate(-5deg); opacity: 0; } }
  .fc-fly.out-knew::after, .fc-fly.out-again::after { position: absolute; top: 50%; left: 50%; z-index: 6; width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; color: #fff; pointer-events: none; animation: fc-stamp 0.3s cubic-bezier(.34,1.6,.4,1); transform: translate(-50%, -50%); }
  .fc-fly.out-knew::after { content: '✓'; background: ${Q.ok}; box-shadow: 0 10px 26px -8px ${Q.ok}; }
  .fc-fly.out-again::after { content: '✗'; background: ${Q.accent}; box-shadow: 0 10px 26px -8px ${Q.accent}; }
  @keyframes fc-stamp { from { transform: translate(-50%, -50%) scale(0); } }
  .fc-card { position: relative; height: clamp(188px,27vh,268px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
  .fc-card.flip { transform: rotateY(180deg); }
  .fc-card:not(.flip):hover { transform: translateY(-3px); }
  .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
  .fc-front { background: ${Q.paper}; border: 2px solid ${Q.line}; box-shadow: 0 14px 34px -18px rgba(${Q.shadowBase || '58, 53, 48'},0.4); }
  .fc-back { background: linear-gradient(160deg, #FF8A3D, ${Q.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(255,79,40,0.6); }
  .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${Q.ink}; line-height: 1.3; text-wrap: balance; }
  .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${Q.ink2}; }
  .fc-tap { color: ${Q.accent}; font-weight: 700; }
  /* F-0803-13/14: javob uzunlikka moslashadi — 4 pog'ona + kod/gap shrift ajrimi */
  .fc-tag { font-weight: 800; letter-spacing: -0.02em; line-height: 1.16; max-width: 100%; text-wrap: balance; overflow-wrap: anywhere; }
  .fc-tag.mono-all { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }
  .fc-tag.prose { font-family: 'Manrope', sans-serif; letter-spacing: -0.005em; }
  .fc-tag .fc-kw { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; }
  .fc-tag.t1 { font-size: clamp(30px,6vw,46px); }
  .fc-tag.t2 { font-size: clamp(24px,4.4vw,34px); }
  .fc-tag.t3 { font-size: clamp(20px,3.4vw,26px); }
  .fc-tag.t4 { font-size: clamp(17px,2.6vw,22px); line-height: 1.3; }
  .fc-note { font-family: 'Manrope'; font-size: 14px; opacity: 0.92; }
  .fc-actions { display: flex; gap: 10px; min-height: 48px; }
  .fc-btn { flex: 1; padding: 13px; border-radius: 13px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; border: none; transition: transform .15s; }
  .fc-btn:hover { transform: translateY(-2px); }
  .fc-btn.knew { background: ${Q.ok}; color: #fff; box-shadow: 0 10px 22px -10px ${Q.ok}; }
  .fc-btn.again { background: ${Q.paper}; border: 2px solid ${Q.accent}66; color: ${Q.accent}; }
  .fc-btn.again:hover { border-color: ${Q.accent}; background: ${Q.accentSoft}; }
  .fc-btn:disabled { opacity: 0.55; cursor: default; transform: none; }
  .fc-btn.ghost { background: ${Q.paper}; border: 1.5px solid ${Q.line}; color: ${Q.ink}; flex: none; align-self: center; padding: 11px 22px; }
  .fc-hint { margin: 0; min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; color: ${Q.ink2}; font-style: italic; font-size: 13px; }
  .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${Q.okFon}; border-radius: 18px; padding: 22px; max-width: 480px; }
  .fc-done-emoji { font-size: 40px; }
  .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${Q.ok}; margin: 0; }
  .fc-done-s { font-family: 'Manrope'; color: ${Q.ink2}; margin: 0 0 8px; font-size: 14px; }

  /* --- 9. Yakun (DE-204, 192, 202): chiplar · «Endi siz bilasiz» · «Uyga vazifa» banneri · nishonlar — texnik darslar standarti aynan --- */
  .q-yakun .card { background: ${Q.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${Q.shadowBase || '58, 53, 48'},0.14); }
  .q-yakun .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
  .q-yakun .card-lbl.ok { color: ${Q.ok}; } .q-yakun .card-lbl.acc { color: ${Q.accent}; }
  .q-yakun .card-lbl .tick { width: 16px; height: 16px; border-radius: 50%; background: ${Q.ok}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; }
  .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
  .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
  .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${Q.ok}; background: ${Q.okFon}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${Q.ok}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
  .hero-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; } .score-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; font-variant-numeric: tabular-nums; color: ${Q.accent}; background: ${Q.accentSoft}; padding: 5px 12px; border-radius: 999px; } /* F-1003-04/05: yakunda halqa o'rniga yorliq */
  .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${Q.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${Q.ok}; font-weight: 700; flex-shrink: 0; background: none; padding: 0; }
  /* F-0803-08 — UYGA VAZIFA KAPSULASI (PmLesson2 etaloni): yakun sahifasida
  «Endi siz bilasiz» dan KEYIN turadi, bosilganda topshiriq kartasi ochiladi. */
  .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); } /* 192 (F-1004-57): platforma standarti — o'rtada, 560px gacha */
  .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
  @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
  .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
  .hw-big:hover { transform: translateY(-3px) scale(1.02); }
  .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; color: rgba(255,255,255,0.16); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
  @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
  .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
  @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.03); } 100% { filter: brightness(1); } }
  .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; }
  .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
  .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent); transform: rotate(8deg); animation: hw-shine 4.6s ease-in-out infinite; pointer-events: none; }
  @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); } 50% { box-shadow: 0 0 0 1px rgba(120,60,220,.6), 0 0 40px rgba(124,58,237,.72), 0 0 96px rgba(124,58,237,.4), inset 0 0 60px rgba(124,58,237,.44); } }
  @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
  @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none !important; } }
  .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${Q.ink}; } .hw li b { color: ${Q.accent}; } .hw .t { color: ${Q.ink2}; } .hw-note.hw-note { margin: 11px 0 0; font-size: 12px; color: ${Q.accent}; font-weight: 600; }
  .ach-coll { display: flex; flex-direction: column; gap: 10px; }
  .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
  .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
  .ach-badge.got { background: linear-gradient(160deg, ${Q.accentSoft}, #FFF3EC); border: 1.5px solid ${Q.accent}55; }
  .ach-badge.got:hover { transform: translateY(-3px); }
  .ach-badge.locked { background: ${Q.bg}; border: 1.5px dashed ${Q.line}; opacity: 0.75; }
  .ach-badge-ic { font-size: 30px; line-height: 1; }
  .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
  .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${Q.ink}; }
  .ach-badge.locked .ach-badge-name { color: ${Q.ink2}; }
  .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${Q.ink2}; line-height: 1.3; }
  @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }

  @media (prefers-reduced-motion: reduce) {
    .q-halqa::after, .q-chip.q-silk, .q-xulosa, .q-xato, .q-fokus, .q-test-v.kutish, .q-test-javob, .q-dd-slot.ok, .q-dd-slot.bad, .q-dd-chip.in { animation: none; }
  }
`;
