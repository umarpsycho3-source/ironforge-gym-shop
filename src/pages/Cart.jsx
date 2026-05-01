import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import './Cart.css';

export default function Cart() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) { navigate('/login?redirect=checkout'); return; }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="cart-empty">
            <ShoppingCart size={80} strokeWidth={1} />
            <h2>Your Cart is Empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/shop" className="btn btn-primary btn-lg" id="empty-cart-shop-btn">
              Browse Shop <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="section-tag">YOUR CART</div>
        <h1 className="section-title" style={{ marginBottom: 40 }}>Shopping <span style={{ color: 'var(--primary)' }}>Cart</span></h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <span className="cart-item-cat">{item.category}</span>
                  <h3>{item.name}</h3>
                  <span className="cart-item-price">${item.price.toFixed(2)}</span>
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} id={`qty-minus-${item.id}`}><Minus size={14} /></button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} id={`qty-plus-${item.id}`}><Plus size={14} /></button>
                </div>
                <span className="cart-item-subtotal">${(item.price * item.qty).toFixed(2)}</span>
                <button className="cart-remove" onClick={() => removeItem(item.id)} id={`remove-${item.id}`}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button className="btn btn-outline btn-sm clear-cart-btn" onClick={clearCart} id="clear-cart-btn">
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{total >= 75 ? <span style={{ color: 'var(--success)' }}>FREE</span> : '$9.99'}</span></div>
            {total < 75 && <p className="free-shipping-note">Add ${(75 - total).toFixed(2)} more for free shipping!</p>}
            <div className="divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${(total >= 75 ? total : total + 9.99).toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-lg checkout-btn" onClick={handleCheckout} id="checkout-btn">
              <ShoppingBag size={18} /> Checkout
            </button>
            <Link to="/shop" className="btn btn-outline continue-btn" id="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
