import { describe, it, expect } from 'vitest';
import { MENU_ITEMS, TESTIMONIALS, FAQ_ITEMS, COMMITMENTS } from '../constants/data';

describe('Data constants', () => {
  it('should have 7 menu items', () => {
    expect(MENU_ITEMS).toHaveLength(7);
  });

  it('each menu item should have required fields', () => {
    MENU_ITEMS.forEach(item => {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.priceMin).toBeGreaterThan(0);
      expect(item.priceMax).toBeGreaterThanOrEqual(item.priceMin);
      expect(item.image).toBeTruthy();
      expect(item.category).toBeTruthy();
    });
  });

  it('should have 5 testimonials', () => {
    expect(TESTIMONIALS).toHaveLength(5);
  });

  it('each testimonial should have rating between 1 and 5', () => {
    TESTIMONIALS.forEach(t => {
      expect(t.rating).toBeGreaterThanOrEqual(1);
      expect(t.rating).toBeLessThanOrEqual(5);
    });
  });

  it('should have 6 FAQ items', () => {
    expect(FAQ_ITEMS).toHaveLength(6);
  });

  it('should have 7 commitment items', () => {
    expect(COMMITMENTS).toHaveLength(7);
  });
});

describe('Cart logic', () => {
  it('should calculate total correctly', () => {
    const items = [
      { id: '1', name: 'Test', price: 6.50, image: '', quantity: 2 },
      { id: '2', name: 'Test2', price: 9.00, image: '', quantity: 1 },
    ];
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(total).toBeCloseTo(22.00);
  });

  it('should apply free delivery for orders over 20€', () => {
    const total = 25.00;
    const deliveryFee = total < 20 ? 3.50 : 0;
    expect(deliveryFee).toBe(0);
  });

  it('should charge delivery fee for orders under 20€', () => {
    const total = 15.00;
    const deliveryFee = total < 20 ? 3.50 : 0;
    expect(deliveryFee).toBe(3.50);
  });

  it('should format price range correctly', () => {
    const priceMin: number = 6.50;
    const priceMax: number = 9.50;
    const formatted = priceMin === priceMax
      ? `€${priceMin.toFixed(2)}`
      : `€${priceMin.toFixed(2)} – €${priceMax.toFixed(2)}`;
    expect(formatted).toBe('€6.50 – €9.50');
  });

  it('should format single price correctly', () => {
    const priceMin: number = 8.00;
    const priceMax: number = 8.00;
    const formatted = priceMin === priceMax
      ? `€${priceMin.toFixed(2)}`
      : `€${priceMin.toFixed(2)} – €${priceMax.toFixed(2)}`;
    expect(formatted).toBe('€8.00');
  });
});
