import { CartItem } from '../../core/entity';
import { som, texts } from './texts';

const items = [
  { product: { name: 'Kolonka', price: 50000 }, qty: 2 },
] as CartItem[];

describe('texts.cart', () => {
  it('etalon koddan', () => {
    const t = texts.cart(items, 100000);
    expect(t).toContain(`Jami: ${som(100000)}`);
  });

  it("etalon qo'lda", () => {
    const t = texts.cart(items, 100000);
    expect(t).toContain("Jami: 100\u00a0000 so'm");
  });
});
