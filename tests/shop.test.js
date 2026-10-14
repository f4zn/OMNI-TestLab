import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTotals, sanitizeState, isValidPassword, selectProducts, DEMO_USER } from '../src/lib/shop.js';
import { products } from '../src/data/products.js';

test('shipping is charged below $100, free at threshold, and absent for empty carts', () => {
  assert.deepEqual(calculateTotals([]), { subtotal: 0, shipping: 0, total: 0 });
  assert.deepEqual(calculateTotals([{ price: 49.99, quantity: 2 }]), { subtotal: 99.98, shipping: 8, total: 107.98 });
  assert.deepEqual(calculateTotals([{ price: 50, quantity: 2 }]), { subtotal: 100, shipping: 0, total: 100 });
});
test('hidden password policy rejects each missing requirement and accepts the demo credential', () => {
  for (const password of ['Short1!', 'lowercase1!', 'UPPERCASE1!', 'NoNumbers!', 'NoSymbols123']) assert.equal(isValidPassword(password), false, password);
  assert.equal(isValidPassword(DEMO_USER.password), true);
});
test('persisted cart rejects unknown, negative, duplicate and noninteger entries and caps quantity', () => {
  const id = products[0].id;
  const result = sanitizeState({ cart: [{ id, quantity: 20 }, { id, quantity: 1 }, { id: 'missing', quantity: 2 }, { id: products[1].id, quantity: -2 }, { id: products[2].id, quantity: 1.5 }], savedIds: [id, id, 'missing'], nextOrderNumber: -2 }, products);
  assert.deepEqual(result.cart, [{ id, quantity: 10 }]);
  assert.deepEqual(result.savedIds, [id]);
  assert.equal(result.nextOrderNumber, 1001);
  assert.equal(sanitizeState(null, products).user, null);
});
test('category, search and saved filtering intersect predictably', () => {
  const product = products[0];
  const result = selectProducts(products, { category: product.category, query: product.name.toUpperCase(), savedOnly: true, savedIds: [product.id] });
  assert.deepEqual(result.map((item) => item.id), [product.id]);
  assert.equal(selectProducts(products, { savedOnly: true }).length, 0);
});
test('price sorting does not mutate product data and new arrivals filter correctly', () => {
  const order = products.map((item) => item.id);
  const sorted = selectProducts(products, { sort: 'price-low' });
  assert.ok(sorted.every((item, index) => index === 0 || sorted[index - 1].price <= item.price));
  assert.deepEqual(products.map((item) => item.id), order);
  assert.ok(selectProducts(products, { newOnly: true }).every((item) => item.newArrival));
});
