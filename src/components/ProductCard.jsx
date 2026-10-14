import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { money } from '../lib/shop';
import Icon from './Icon';
import Modal from './Modal';

export default function ProductCard({ product }) {
  const { addToCart, savedIds, toggleSaved } = useShop();
  const [open, setOpen] = useState(false);
  const saved = savedIds.includes(product.id);
  return <article className="product-card" data-testid={`product-${product.id}`}>
    <div className="product-visual"><button className="product-image-button" aria-label={`View ${product.name}`} onClick={() => setOpen(true)}><img src={product.image} alt={product.name} loading="lazy" width="600" height="660" /></button>
      {product.badge && <span className={`product-badge ${product.badge === 'New' ? 'badge-new' : ''}`}>{product.badge}</span>}
      {/* UX-007 and UX-012: icon-only, small save target. */}
      <button className={`save-button touch-small ${saved ? 'is-saved' : ''}`} aria-label={`${saved ? 'Unsave' : 'Save'} ${product.name}`} aria-pressed={saved} onClick={() => toggleSaved(product.id)}><Icon name="heart" size={16} /></button>
    </div>
    <div className="product-meta"><span className="product-category">{product.category}</span><span className="product-rating"><Icon name="star" size={11} /> {product.rating} <span className="muted">({product.reviewCount})</span></span></div>
    <button className="product-name" onClick={() => setOpen(true)}>{product.name}</button>
    <p className="product-description muted">{product.description}</p>
    <div className="product-bottom"><div className="product-price">{money(product.price)} {product.originalPrice && <s>{money(product.originalPrice)}</s>}</div><button className="add-button" onClick={() => addToCart(product.id)} aria-label={`Add ${product.name} to bag`}>Add to bag <Icon name="plus" size={15} /></button></div>
    {open && <Modal title={product.name} onClose={() => setOpen(false)} className="product-modal"><img src={product.image} alt={product.name} /><span className="eyebrow">{product.category} · {product.color}</span><p>{product.description} A considered addition to your daily routine, with a simple silhouette and a finish made to feel at home.</p><div className="product-modal-bottom"><strong>{money(product.price)}</strong><button className="button button-primary" onClick={() => { addToCart(product.id); setOpen(false); }}>Add to bag <Icon name="plus" size={18} /></button></div></Modal>}
  </article>;
}
