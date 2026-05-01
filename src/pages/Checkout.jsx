import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, MapPin, User, Truck } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const STEPS = ['Shipping', 'Payment', 'Confirm'];

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [shipping, setShipping] = useState({ name: user?.name || '', address: '', city: '', zip: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [payment, setPayment] = useState({ card: '', expiry: '', cvv: '', name: '' });
  const [error, setError] = useState('');

  const shippingCost = total >= 75 ? 0 : 9.99;
  const grandTotal = total + shippingCost;

  const handlePlaceOrder = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/orders',
        { items, total: grandTotal.toFixed(2), paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrderId(res.data.id);
      
      // Simulated Notification Alert
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
      
      clearCart();
      setPlaced(true);
    } catch {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (placed) return (
    <div className="page">
      <div className="container">
        <div className="order-success">
          <div className="success-icon"><CheckCircle size={64} /></div>
          <h2>Order Placed!</h2>
          <p>Thank you, <strong>{user?.name}</strong>! Your order <strong>#{orderId}</strong> has been confirmed.</p>
          <p className="success-sub">You'll receive a confirmation email shortly. Estimated delivery: 3-5 business days.</p>
          <div className="alert alert-success" style={{ marginTop: 20 }}>
            🔔 <strong>Real-time Alert:</strong> Our team has been notified of your {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'} order!
          </div>
          <div className="success-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/orders')} id="view-orders-btn">View My Orders</button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/shop')} id="keep-shopping-btn">Keep Shopping</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="container">
        <div className="section-tag">SECURE CHECKOUT</div>
        <h1 className="section-title" style={{ marginBottom: 40 }}>
          Checkout <span style={{ color: 'var(--primary)' }}>({items.length} item{items.length !== 1 ? 's' : ''})</span>
        </h1>

        {/* Steps */}
        <div className="checkout-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`checkout-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-num">{i < step ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-form">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <div className="card">
                <h3><MapPin size={18} /> Shipping Information</h3>
                <div className="divider" />
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} placeholder="John Doe" id="ship-name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input className="form-input" value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })} placeholder="United States" id="ship-country" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input className="form-input" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} placeholder="123 Main Street" id="ship-address" />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} placeholder="New York" id="ship-city" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP Code</label>
                    <input className="form-input" value={shipping.zip} onChange={e => setShipping({ ...shipping, zip: e.target.value })} placeholder="10001" id="ship-zip" />
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-lg" id="next-to-payment"
                  disabled={!shipping.name || !shipping.address || !shipping.city || !shipping.zip}
                  onClick={() => setStep(1)}
                >Continue to Payment</button>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="card">
                <h3><CreditCard size={18} /> Payment Selection</h3>
                <div className="divider" />
                
                <div className="payment-methods">
                  <div className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
                    <CreditCard size={24} />
                    <span>Credit / Debit Card</span>
                  </div>
                  <div className={`payment-method-card ${paymentMethod === 'cod' ? 'active' : ''}`} onClick={() => setPaymentMethod('cod')}>
                    <Truck size={24} />
                    <span>Cash on Delivery</span>
                  </div>
                </div>

                <div className="divider" />

                {paymentMethod === 'card' ? (
                  <div className="card-fields animate-in">
                    <div className="demo-notice">🔒 Demo Mode — Enter any card details to test</div>
                    <div className="form-group">
                      <label className="form-label">Cardholder Name</label>
                      <input className="form-input" value={payment.name} onChange={e => setPayment({ ...payment, name: e.target.value })} placeholder="John Doe" id="pay-name" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input className="form-input" value={payment.card}
                        onChange={e => setPayment({ ...payment, card: e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim() })}
                        placeholder="1234 5678 9012 3456" id="pay-card" />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input className="form-input" value={payment.expiry}
                          onChange={e => setPayment({ ...payment, expiry: e.target.value })}
                          placeholder="MM/YY" id="pay-expiry" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input className="form-input" value={payment.cvv}
                          onChange={e => setPayment({ ...payment, cvv: e.target.value.slice(0,4) })}
                          placeholder="123" id="pay-cvv" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="cod-notice animate-in">
                    <p>Pay with cash when your gym equipment arrives at your door.</p>
                    <div className="alert alert-success">✅ COD is available for your location!</div>
                  </div>
                )}

                <div className="step-btns">
                  <button className="btn btn-outline" onClick={() => setStep(0)} id="back-to-shipping">Back</button>
                  <button
                    className="btn btn-primary btn-lg" id="next-to-confirm"
                    disabled={paymentMethod === 'card' && (!payment.card || !payment.expiry || !payment.cvv || !payment.name)}
                    onClick={() => setStep(2)}
                  >Review Order</button>
                </div>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <div className="card">
                <h3><User size={18} /> Order Review</h3>
                <div className="divider" />
                {error && <div className="alert alert-error">{error}</div>}
                <div className="review-section">
                  <h4>Shipping to</h4>
                  <p>{shipping.name} — {shipping.address}, {shipping.city} {shipping.zip}, {shipping.country}</p>
                </div>
                <div className="review-section">
                  <h4>Payment Method</h4>
                  <p>{paymentMethod === 'card' ? `Card ending in ${payment.card.replace(/\s/g,'').slice(-4)}` : 'Cash on Delivery'}</p>
                </div>
                <div className="review-items">
                  {items.map(item => (
                    <div className="review-item" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <span>{item.name}</span>
                      <span>×{item.qty}</span>
                      <span>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="step-btns">
                  <button className="btn btn-outline" onClick={() => setStep(1)} id="back-to-payment">Back</button>
                  <button className="btn btn-primary btn-lg" onClick={handlePlaceOrder} disabled={loading} id="place-order-btn">
                    {loading ? 'Placing Order...' : `Place Order — $${grandTotal.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-summary">
            <div className="card">
              <h3>Order Summary</h3>
              <div className="divider" />
              {items.map(item => (
                <div className="co-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="co-item-info">
                    <span>{item.name}</span>
                    <small>Qty: {item.qty}</small>
                  </div>
                  <span className="co-item-price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="divider" />
              <div className="co-row"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="co-row"><span>Shipping</span><span>{shippingCost === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `$${shippingCost}`}</span></div>
              <div className="divider" />
              <div className="co-row co-total"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
