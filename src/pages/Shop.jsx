import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const CATEGORIES = ['all', 'equipment', 'supplements', 'apparel'];
const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat') || 'all';

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const setCategory = (cat) => {
    if (cat === 'all') setSearchParams({});
    else setSearchParams({ cat });
  };

  const filtered = products
    .filter(p => catParam === 'all' || p.category === catParam)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) ||
                 p.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="shop-header">
          <div>
            <div className="section-tag">OUR STORE</div>
            <h1 className="section-title">Shop <span style={{ color: 'var(--primary)' }}>Products</span></h1>
            <p className="section-subtitle">Premium gear for every type of athlete.</p>
          </div>
        </div>

        {/* Controls */}
        <div className="shop-controls">
          <div className="shop-cats">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${catParam === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
                id={`cat-filter-${cat}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="shop-filters">
            <div className="search-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-input search-input"
                id="product-search"
              />
              {search && <button className="search-clear" onClick={() => setSearch('')}><X size={14} /></button>}
            </div>
            <div className="sort-wrap">
              <SlidersHorizontal size={16} />
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="form-input sort-select"
                id="product-sort"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="shop-results-info">
          <span>{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</span>
        </div>

        {/* Products */}
        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>No products found. Try adjusting your search or filters.</p>
            <button className="btn btn-outline" onClick={() => { setSearch(''); setCategory('all'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
