export const STORAGE_KEY = 'omni-testlab:v1';
export const DEMO_USER = { name: 'Alex Morgan', email: 'demo@omni.test', password: 'OmniDemo123!' };
export const initialState = { cart: [], savedIds: [], users: [], user: null, lastOrder: null, nextOrderNumber: 1001 };

export const normalizeEmail = (email) => email.trim().toLowerCase();
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidPassword = (password) => password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password);
export const money = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export function calculateTotals(items) {
  const subtotal = Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8;
  return { subtotal, shipping, total: Math.round((subtotal + shipping) * 100) / 100 };
}

export function sanitizeState(value, products) {
  if (!value || typeof value !== 'object') return { ...initialState };
  const ids = new Set(products.map((product) => product.id));
  const cart = [];
  for (const item of Array.isArray(value.cart) ? value.cart : []) {
    if (item && ids.has(item.id) && Number.isInteger(item.quantity) && item.quantity > 0 && !cart.some((entry) => entry.id === item.id)) {
      cart.push({ id: item.id, quantity: Math.min(item.quantity, 10) });
    }
  }
  const users = (Array.isArray(value.users) ? value.users : []).filter((user) => user && typeof user.name === 'string' && typeof user.email === 'string' && typeof user.password === 'string');
  const user = value.user && typeof value.user.name === 'string' && typeof value.user.email === 'string' ? { name: value.user.name, email: value.user.email } : null;
  const lastOrder = value.lastOrder && typeof value.lastOrder.id === 'string' && Array.isArray(value.lastOrder.items) && Number.isFinite(value.lastOrder.total) ? value.lastOrder : null;
  return { cart, users, user, lastOrder,
    savedIds: [...new Set((Array.isArray(value.savedIds) ? value.savedIds : []).filter((id) => ids.has(id)))],
    nextOrderNumber: Number.isSafeInteger(value.nextOrderNumber) && value.nextOrderNumber >= 1001 ? value.nextOrderNumber : 1001 };
}

export function selectProducts(products, { category = 'All', query = '', sort = 'featured', savedOnly = false, savedIds = [], newOnly = false }) {
  const filtered = products.filter((product) => (category === 'All' || product.category === category)
    && (!savedOnly || savedIds.includes(product.id)) && (!newOnly || product.newArrival)
    && `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
  return filtered;
}
