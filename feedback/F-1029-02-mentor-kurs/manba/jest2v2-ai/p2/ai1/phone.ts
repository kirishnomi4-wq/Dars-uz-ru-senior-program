// Telefon raqami: ixtiyoriy «+» va 9 tadan 13 tagacha raqam, boshqa belgi yo'q
const PHONE = /^\+?\d{9,13}$/;

export function isPhone(text: string): boolean {
  return PHONE.test(text);
}
