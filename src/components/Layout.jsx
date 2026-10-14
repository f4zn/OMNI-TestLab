import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Icon from './Icon';
import Modal from './Modal';

function Brand() { return <Link className="brand" to="/" aria-label="OMNI TestLab home"><span className="brand-mark">o<span>m</span>ni<span className="brand-dot">.</span></span><span className="brand-label">TESTLAB</span></Link>; }

export default function Layout() {
  const { cartItems, user } = useShop();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [info, setInfo] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); setSearchOpen(false); }, [location.pathname, location.search]);
  const content = {
    'Shipping & returns': 'Standard delivery is $8, or complimentary on orders of $100 or more. Your order arrives in 3–5 business days. Returns are accepted within 30 days in original condition.',
    'Our approach': 'Fewer things, better chosen. We bring together useful, considered objects that make a little more room for the everyday. Explore our collection of home, work, and life essentials.',
    'Privacy': 'Account, bag, and order information is kept in this browser. No account information or payment details are sent to a server. You can clear this information through your browser’s site settings.',
  };
  return <>
    <div className="announcement"><span>A little something for your everyday.</span><span>Complimentary shipping on orders $100+ <Icon name="arrow" size={13} /></span><span>Thoughtfully chosen. Always.</span></div>
    <header className="site-header"><div className="header-inner"><Brand />
      {/* UX-004: broad editorial labels obscure the underlying destinations. */}
      <nav className="main-nav" aria-label="Main navigation"><NavLink to="/" end>Discover</NavLink><NavLink to="/products">The Edit</NavLink><NavLink to="/login">Your Space</NavLink></nav>
      <div className="header-actions">
        {/* UX-007: controls have accessible names, but no visible text labels. */}
        <button className="icon-button" aria-label="Search products" onClick={() => setSearchOpen(!searchOpen)}><Icon name="search" /></button>
        <Link className="icon-button" to="/login" aria-label={user ? 'Your account' : 'Log in'}><Icon name="user" /></Link>
        <Link className="icon-button bag-link" to="/cart" aria-label={`Shopping bag, ${cartItems.reduce((sum, item) => sum + item.quantity, 0)} items`}><Icon name="bag" /><span className="bag-count">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span></Link>
      </div>
    </div>
    {searchOpen && <form className="header-search" onSubmit={(event) => { event.preventDefault(); navigate(`/products?q=${encodeURIComponent(query.trim())}`); }}><label htmlFor="header-query">What are you looking for?</label><div><input id="header-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try a lamp, a cup, a little inspiration…" autoFocus /><button className="button button-primary" type="submit">Search <Icon name="arrow" size={16} /></button></div></form>}
    </header>
    <main id="main-content"><Outlet /></main>
    <footer className="site-footer"><div className="footer-main"><div><Brand /><p>Thoughtful objects. Everyday joy.</p></div><div className="footer-links"><Link to="/products">Explore the collection</Link><button onClick={() => setInfo('Our approach')}>Our approach</button><button onClick={() => setInfo('Shipping & returns')}>Shipping & returns</button><button onClick={() => setInfo('Privacy')}>Privacy</button></div><span className="footer-note">A more considered kind of everyday.<span>Made for the way you live.</span></span></div><div className="footer-bottom"><span>© 2026 OMNI TestLab. All rights reserved.</span><span>USD $ <span className="footer-separator">/</span> English</span></div></footer>
    {info && <Modal title={info} onClose={() => setInfo(null)}><p className="info-copy">{content[info]}</p><button className="button button-primary" onClick={() => setInfo(null)}>Got it</button></Modal>}
  </>;
}
