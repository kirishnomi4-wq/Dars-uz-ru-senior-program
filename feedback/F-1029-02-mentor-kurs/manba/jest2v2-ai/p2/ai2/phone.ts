// Telefon: ixtiyoriy «+» va 9–13 ta raqam. Bo'sh joy yoki harf bo'lsa — noto'g'ri.
export function isPhone(text: string): boolean {
  return /^\+?\d{9,13}$/.test(text);
}
