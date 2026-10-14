import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';

export default function App() {
  return <Routes><Route element={<Layout />}><Route index element={<HomePage />} /><Route path="products" element={<ProductsPage />} /><Route path="login" element={<AuthPage />} /><Route path="cart" element={<CartPage />} /><Route path="checkout" element={<CheckoutPage />} /><Route path="*" element={<div className="page-container empty-state"><h1>A little off the beaten path.</h1><p>We couldn’t find that page.</p><Link className="button button-primary" to="/">Back to discovering</Link></div>} /></Route></Routes>;
}
