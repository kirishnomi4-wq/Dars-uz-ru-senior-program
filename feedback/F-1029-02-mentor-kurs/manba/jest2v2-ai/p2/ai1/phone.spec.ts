import { isPhone } from './phone';

describe('isPhone', () => {
  it.each([
    { nomi: "to'g'ri raqam", text: '+998901234567', kutilgan: true },
    { nomi: "to'g'ri raqam, «+» siz", text: '998901234567', kutilgan: true },
    { nomi: 'eng qisqa — 9 raqam', text: '901234567', kutilgan: true },
    { nomi: 'eng uzun — 13 raqam', text: '+9989012345678', kutilgan: true },
    { nomi: 'bittaga qisqa — 8 raqam', text: '90123456', kutilgan: false },
    { nomi: 'bittaga uzun — 14 raqam', text: '+99890123456789', kutilgan: false },
    { nomi: 'harf aralashgan', text: '+99890abc4567', kutilgan: false },
    { nomi: "bo'sh satr", text: '', kutilgan: false },
    { nomi: 'probel bilan', text: '+998 90 123 45 67', kutilgan: false },
  ])('$nomi: «$text» → $kutilgan', ({ text, kutilgan }) => {
    expect(isPhone(text)).toBe(kutilgan);
  });
});
