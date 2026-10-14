import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { products, categories } from '../data/products';
import { useShop } from '../context/ShopContext';
import { selectProducts } from '../lib/shop';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';
import Modal from '../components/Modal';

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const { savedIds } = useShop();
  const category = categories.includes(params.get('category')) ? params.get('category') : 'All';
  const query = params.get('q') || '';
  const newOnly = params.get('new') === '1';
  const [sort, setSort] = useState('featured');
  const savedOnly = params.get('saved') === '1';
  const setSavedOnly = (value) => updateParam('saved', value ? '1' : '');
  const [filterStep, setFilterStep] = useState(null);
  const [draft, setDraft] = useState(category);
  const visibleProducts = useMemo(() => selectProducts(products, { category, query, sort, savedOnly, savedIds, newOnly }), [category, query, sort, savedOnly, savedIds, newOnly]);
  const updateParam = (key, value) => { const next = new URLSearchParams(params); value ? next.set(key, value) : next.delete(key); setParams(next, { replace: true }); };
  return <div className="page-container products-page"><div className="breadcrumb"><Link to="/">Discover</Link><Icon name="chevron" size={12} /><span>The Edit</span></div><header className="catalog-heading"><div><span className="eyebrow">THOUGHTFULLY CHOSEN, EVERY DAY.</span><h1>{newOnly ? 'New to the everyday.' : 'The everyday edit.'}</h1><p>Good design. Quiet details. Things you’ll reach for again and again.</p></div><span className="catalog-decoration">✳</span></header>
    <div className="catalog-toolbar"><div className="catalog-tools"><button className="button button-outline filter-button" onClick={() => { setDraft(category); setFilterStep('select'); }}><Icon name="filter" size={17} /> Filters {category !== 'All' && <span className="filter-count">1</span>}</button><label className="catalog-search"><Icon name="search" size={17} /><span className="sr-only">Search collection</span><input value={query} onChange={(event) => updateParam('q', event.target.value)} placeholder="Find your next favorite" /></label><button className={`saved-filter ${savedOnly ? 'selected' : ''}`} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Icon name="heart" size={16} /> Saved ({savedIds.length})</button></div><label className="sort-control">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select></label></div>
    <div className="catalog-result-line"><span className="muted" role="status">{visibleProducts.length} considered essentials</span><div className="active-filters">{category !== 'All' && <button onClick={() => updateParam('category', '')}>{category} <Icon name="close" size={12} /></button>}{newOnly && <button onClick={() => updateParam('new', '')}>New arrivals <Icon name="close" size={12} /></button>}</div></div>
    {/* UX-013: the two-column mobile grid intentionally exceeds narrow viewports. */}
    <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    {visibleProducts.length === 0 && <div className="empty-state"><Icon name="search" size={40} /><h2>Nothing here just yet.</h2><p>Try another search or give your filters a fresh start.</p><button className="button button-primary" onClick={() => setParams({})}>Show all essentials</button></div>}
    <div className="catalog-end"><span />A few good things. A whole lot of everyday.<span /></div>
    {/* UX-010: select → review → confirm → apply, instead of immediate filtering. */}
    {filterStep && <Modal title={filterStep === 'select' ? 'Refine your edit' : filterStep === 'review' ? 'Review your selection' : 'Ready to update your edit?'} onClose={() => setFilterStep(null)}>
      {filterStep === 'select' ? <><p className="filter-explanation">Start with a collection.</p><div className="filter-options">{['All', ...categories].map((name) => <label key={name} className={draft === name ? 'chosen' : ''}><input type="radio" name="category" value={name} checked={draft === name} onChange={() => setDraft(name)} /><span>{name === 'All' ? 'All essentials' : name}</span><small>{name === 'All' ? products.length : products.filter((product) => product.category === name).length}</small></label>)}</div><button className="button button-primary full-width" onClick={() => setFilterStep('review')}>Review selection <Icon name="arrow" size={17} /></button></>
        : filterStep === 'review' ? <><p>Your selected collection:</p><div className="filter-review"><Icon name="box" size={24} /><strong>{draft === 'All' ? 'All essentials' : draft}</strong></div><div className="modal-actions"><button className="button button-secondary" onClick={() => setFilterStep('select')}>Back</button><button className="button button-primary" onClick={() => setFilterStep('apply')}>Confirm selection <Icon name="check" size={17} /></button></div></>
          : <><p>Apply your selection to view {draft === 'All' ? 'all essentials' : `the ${draft.toLowerCase()} collection`}.</p><div className="modal-actions"><button className="button button-secondary" onClick={() => setFilterStep('review')}>Back</button><button className="button button-primary" onClick={() => { updateParam('category', draft === 'All' ? '' : draft); setFilterStep(null); }}>Apply filters <Icon name="arrow" size={17} /></button></div></>}
    </Modal>}
  </div>;
}
