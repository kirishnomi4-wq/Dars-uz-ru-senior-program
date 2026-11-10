// Telefon raqami: + bilan yoki + siz, 9–13 ta raqam
export const PHONE = /^\+?\d{9,13}$/;

export const isPhone = (text: string) => PHONE.test(text.trim());
