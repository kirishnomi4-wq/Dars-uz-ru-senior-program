// ============================================================================
// QOLIP · RANG (D3, F-1004 2-qism, 04.10.2026)
// Uch guruh: NEYTRAL (5) · MODUL RANGI (2) · HOLAT (2 rang + 2 fon: okFon, errFon — 202-qonun).
// Darsda boshqa rang tokeni yo'q (blue/honey/grape/violet/amber olindi). Fon faqat holatda (185):
// tanlangan — accentSoft, to'g'ri — okFon, xato — errFon. fon() — faqat soya/chiroq kabi shaffof qatlam uchun.
// Darvoza: lint-qolip q13 (T.<nom> ruxsat ro'yxatida) · q14 (palitra qolipRang dan).
// ============================================================================

// Neytral — modulga qarab tus oladi (tex: iliq kulrang, pm: binafsha kulrang), lekin har doim 5 ta.
export const NEYTRAL = {
  tex: { bg: '#F6F4EF', paper: '#FFFFFF', line: '#E9E6DF', ink2: '#5A5A60', ink: '#0E0E10' },
  pm: { bg: '#F2F0FA', paper: '#FFFFFF', line: '#E7E3F4', ink2: '#565073', ink: '#1B1630' },
};

// Modul rangi — bitta asosiy rang va uning yumshoq foni.
export const MODUL_RANGI = {
  tex: { accent: '#FF4F28', accentSoft: '#FFE8E1' },
  pm: { accent: '#5B3DE6', accentSoft: '#EBE5FD' },
};

// Holat — faqat to'g'ri / xato. Foni — texnik darslardagi yashil/qizil fon AYNAN (202-qonun, F-1004-58: «tex uroklarimiznikiday yashil»);
// 83 texnik darsning .frame-success foni #E3F0E8 — butun platformada bitta yashil.
export const HOLAT = { ok: '#1F7A4D', okFon: '#E3F0E8', err: '#C2362B', errFon: '#FAE3E0' };

export const RUXSAT_TOKEN = ['bg', 'paper', 'line', 'ink2', 'ink', 'accent', 'accentSoft', 'ok', 'okFon', 'err', 'errFon'];

// Holat foni: hex → rgba (token emas, shaffof qatlam)
export const fon = (hex, a = 0.12) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// Darsning palitrasi: qolipRang('tex') yoki qolipRang('pm')
export const qolipRang = (modul = 'tex') => ({
  ...(NEYTRAL[modul] || NEYTRAL.tex),
  ...(MODUL_RANGI[modul] || MODUL_RANGI.tex),
  ...HOLAT,
});
