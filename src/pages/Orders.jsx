import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const STATUS_MAP = {
  pending: { label: 'Pending', icon: <Clock size={14} />, cls: 'badge-warning' },
  processing: { label: 'Processing', icon: <Package size={14} />, cls: 'badge-primary' },
  shipped: { label: 'Shipped', icon: <Truck size={14} />, cls: 'badge-primary' },
  delivered: { label: 'Delivered', icon: <CheckCircle size={14} />, cls: 'badge-success' },
  cancelled: { label: 'Cancelled', icon: <XCircle size={14} />, cls: 'badge-error' },
};

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios.get('https://ironforge-gym-shop.onrender.com/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setOrders(res.data.reverse()); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const handleCancelOrder = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await axios.put(`https://ironforge-gym-shop.onrender.com/api/orders/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel order');
    }
  };

  if (loading) return <div className="page"><div className="container"><div className="spinner" /></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="section-tag">ACCOUNT</div>
        <h1 className="section-title" style={{ marginBottom: 40 }}>My <span style={{ color: 'var(--primary)' }}>Orders</span></h1>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <Package size={72} strokeWidth={1} />
            <h3>No orders yet</h3>
            <p>Your order history will appear here once you make a purchase.</p>
            <Link to="/shop" className="btn btn-primary btn-lg" id="start-shopping-btn">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const status = STATUS_MAP[order.status] || STATUS_MAP.pending;
              const isOpen = expanded === order.id;
              return (
                <div className="order-card" key={order.id}>
                  <div className="order-header" onClick={() => setExpanded(isOpen ? null : order.id)}>
                    <div className="order-info">
                      <span className="order-id">Order #{order.id}</span>
                      <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="order-meta">
                      <span className={`badge ${status.cls}`}>{status.icon} {status.label}</span>
                      <span className="order-total">${Number(order.total).toFixed(2)}</span>
                      <span className="order-toggle">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="order-body">
                      <div className="order-items">
                        {order.items.map((item, i) => (
                          <div className="order-item" key={i}>
                            <img src={item.image} alt={item.name} />
                            <div className="order-item-info">
                              <strong>{item.name}</strong>
                              <span>{item.category} · Qty: {item.qty}</span>
                            </div>
                            <span className="order-item-price">${(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-footer-row">
                        <span className="order-count">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                          {(order.status === 'pending' || order.status === 'processing') && (
                            <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); handleCancelOrder(order.id); }}>Cancel Order</button>
                          )}
                          <span className="order-total-lg">Total: <strong>${Number(order.total).toFixed(2)}</strong></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
