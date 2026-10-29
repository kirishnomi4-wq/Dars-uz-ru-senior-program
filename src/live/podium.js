// CodeStrike podium (F-1023-01, Abdulloh QA 28.10 — PODIUM-01…04 + teng ochko): jonli arena yakunidagi o'rin.
// O'rin endi arena oynasida emas, shu modulda hisoblanadi — useLiveSession mentor testni yakunlagach (quiz_state 'done')
// jadvalni serverdan QAYTA yuklab, shu funksiyalar bilan o'rinni topadi. Arena ekranidagi jadval ham shu tartibni oladi
// (arenaOrder) — o'quvchi ko'rgan o'rin bilan LMS'ga ketgan o'rin bitta qoidadan chiqadi.
// Ochko formulasi darsdagi quizPts/quizScore bilan AYNAN bir xil (183 dars, podium.test.mjs darsdan olib solishtiradi).

/** Javob tezligi: 0,5 s gacha 1000, keyin vaqt o'tishi bilan 500 gacha kamayadi (darsdagi quizPts). */
export const arenaPoints = (elapsedMs, quizMs) => (elapsedMs <= 500 ? 1000 : Math.max(0, Math.round(1000 * (1 - (Math.min(elapsedMs, quizMs) / quizMs) / 2))));

/** Bitta o'yinchining javoblari → { pts, ok } (darsdagi quizScore: ketma-ket 2+ to'g'ri — har biriga +100). */
export function arenaScore(rows, { total, quizMs, baseIdx }) {
  const byQ = {};
  rows.forEach((r) => { byQ[r.screen_idx - baseIdx] = r; });
  let pts = 0, streak = 0, ok = 0;
  for (let i = 0; i < total; i++) {
    const a = byQ[i];
    if (a && a.correct) { streak++; ok++; pts += arenaPoints(a.elapsed_ms, quizMs) + (streak >= 2 ? 100 : 0); }
    else streak = 0;
  }
  return { pts, ok };
}

/**
 * Jadval tartibi: ochko ↓ · to'g'ri javoblar ↓ · teng bo'lsa — oldin qo'shilgan yuqorida · keyin o'yinchi id'si.
 * Oxirgi ikki band hamma klientda bir xil o'rin chiqishi uchun (sovrinli o'rin ikki o'quvchiga tushmaydi).
 */
export function arenaOrder(players) {
  const key = new Map((players || []).map((p) => [p.id, { t: Date.parse(p.joined_at) || 0, id: String(p.id) }]));
  const k = (x) => key.get(x.id) || { t: 0, id: String(x.id) };
  return (a, b) => b.pts - a.pts || b.ok - a.ok || k(a).t - k(b).t || (k(a).id < k(b).id ? -1 : k(a).id > k(b).id ? 1 : 0);
}

/** O'yinchining o'rni (1, 2, …) yoki 0 — jadvalda yo'q. */
export function arenaPlaceOf(players, rows, playerId, opts) {
  if (!playerId || !Array.isArray(players) || !Array.isArray(rows)) return 0;
  const board = players.map((p) => ({ id: p.id, ...arenaScore(rows.filter((r) => r.player_id === p.id), opts) })).sort(arenaOrder(players));
  return board.findIndex((b) => b.id === playerId) + 1;
}

/** LMS shartnomasi: `place` faqat 1, 2, 3 yoki null (PODIUM-01: 4+ bo'lsa 422 — butun natija saqlanmaydi). */
export const PODIUM_PLACES = 3;
export const podiumPlace = (place) => (Number.isInteger(place) && place >= 1 && place <= PODIUM_PLACES ? place : null);

// «Tamom» ushlab turilganda (useLiveSession.holdFinish) FinishBtn «Dars yakunlandi ✓ — oynani yopsangiz bo'ladi» xabarini
// darhol ko'rsatmaydi: yuk hali ketmagan, oyna yopilsa natija yo'qoladi. Xabar yuk haqiqatda ketganda (release) chiqadi.
let finishHeld = false;
const onRelease = new Set();
export const finishHold = {
  get: () => finishHeld,
  set(v) { finishHeld = !!v; if (!finishHeld) { const l = [...onRelease]; onRelease.clear(); l.forEach((f) => { try { f(); } catch { /* jim */ } }); } },
  whenReleased(f) { if (typeof f === 'function') onRelease.add(f); },
};
