import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { products } from '../data/products';
import { STORAGE_KEY, DEMO_USER, initialState, sanitizeState, normalizeEmail, isValidEmail, isValidPassword, calculateTotals } from '../lib/shop';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [state, setState] = useState(() => {
    try { return sanitizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)), products); }
    catch { return { ...initialState }; }
  });
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* The journey also works when storage is unavailable. */ } }, [state]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const notify = (message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(''), 3500);
  };
  const cartItems = state.cart.map((item) => ({ ...products.find((product) => product.id === item.id), quantity: item.quantity }));
  const totals = calculateTotals(cartItems);
  const addToCart = (id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const existing = state.cart.find((item) => item.id === id);
    if (existing?.quantity >= 10) { notify('A maximum of 10 per item is available.'); return; }
    setState((current) => ({ ...current, cart: current.cart.some((item) => item.id === id)
      ? current.cart.map((item) => item.id === id ? { ...item, quantity: Math.min(item.quantity + 1, 10) } : item)
      : [...current.cart, { id, quantity: 1 }] }));
    notify(`${product.name} added to your bag.`);
  };
  const updateQuantity = (id, quantity) => setState((current) => ({ ...current, cart: current.cart.map((item) => item.id === id ? { ...item, quantity: Math.max(0, Math.min(10, quantity)) } : item).filter((item) => item.quantity > 0) }));
  const removeFromCart = (id) => setState((current) => ({ ...current, cart: current.cart.filter((item) => item.id !== id) }));
  const toggleSaved = (id) => setState((current) => ({ ...current, savedIds: current.savedIds.includes(id) ? current.savedIds.filter((saved) => saved !== id) : [...current.savedIds, id] }));
  const login = (email, password) => {
    const account = [DEMO_USER, ...state.users].find((entry) => entry.email === normalizeEmail(email) && entry.password === password);
    // UX-003: deliberately vague authentication feedback.
    if (!account) return { ok: false, error: 'Something went wrong' };
    setState((current) => ({ ...current, user: { name: account.name, email: account.email } }));
    return { ok: true };
  };
  const signup = ({ name, email, password }) => {
    const normalized = normalizeEmail(email);
    if (!name.trim() || !isValidEmail(normalized)) return { ok: false, error: 'Enter your name and a valid email address.' };
    // UX-001: requirements are revealed only after a failed submission.
    if (!isValidPassword(password)) return { ok: false, error: 'Use at least 8 characters, an uppercase letter, a lowercase letter, a number, and a symbol (!@#$%^&*).' };
    if ([DEMO_USER, ...state.users].some((entry) => entry.email === normalized)) return { ok: false, error: 'An account with this email already exists.' };
    const account = { name: name.trim(), email: normalized, password };
    setState((current) => ({ ...current, users: [...current.users, account], user: { name: account.name, email: account.email } }));
    return { ok: true };
  };
  const logout = () => setState((current) => ({ ...current, user: null }));
  const completeOrder = (details) => {
    if (!cartItems.length) return null;
    const order = { ...details, accountEmail: state.user?.email || null, id: `OMNI-${state.nextOrderNumber}`, items: cartItems, ...totals };
    setState((current) => ({ ...current, cart: [], lastOrder: order, nextOrderNumber: current.nextOrderNumber + 1 }));
    return order;
  };
  return <ShopContext.Provider value={{ ...state, cartItems, ...totals, addToCart, updateQuantity, removeFromCart, toggleSaved, login, signup, logout, completeOrder, notify }}>
    {children}
    {toast && <div className="toast" role="status"><span className="toast-check">✓</span>{toast}</div>}
  </ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
