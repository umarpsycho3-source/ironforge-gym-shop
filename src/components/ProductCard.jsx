import { ShoppingCart, Star, Zap, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-img-wrap">
          <img 
            src={product.image} 
            alt={product.name} 
            loading="lazy" 
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80';
              e.target.style.filter = 'grayscale(1) brightness(0.5)';
            }}
          />
          <span className="product-cat-badge">{product.category}</span>
          {product.stock <= 5 && <span className="product-low-stock">Low Stock</span>}
        </div>
        <div className="product-body">
          <div className="product-rating">
            <Star size={13} fill="currentColor" />
            <span>{product.rating}</span>
            <span className="product-reviews">({product.reviews?.length || 0})</span>
          </div>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-desc">{product.description}</p>
          <div className="product-footer">
            <span className="product-price">${product.price.toFixed(2)}</span>
            <button
              className={`btn btn-primary btn-sm product-add-btn ${added ? 'added' : ''}`}
              onClick={handleAdd}
              disabled={product.stock === 0}
              id={`add-to-cart-${product.id}`}
            >
              {added ? <><Zap size={14} /> Added!</> : <><ShoppingCart size={14} /> Add</>}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
