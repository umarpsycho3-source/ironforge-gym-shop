import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Users, DollarSign, Plus, Trash2, Edit2, CheckCircle, Clock, MessageSquare, Bell } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

export default function Admin() {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalOrders: 0, totalProducts: 0, totalUsers: 0, revenue: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('stats');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', price: '', category: 'equipment', image: '', description: '', stock: 0 });

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    
    const fetchData = async () => {
      try {
        // Fetch products first (public, doesn't need admin token)
        const prodRes = await axios.get('https://ironforge-gym-shop.onrender.com/api/products');
        setProducts(prodRes.data);

        // Try fetching protected data individually to avoid complete crash if one fails
        try {
          const statsRes = await axios.get('https://ironforge-gym-shop.onrender.com/api/stats', { headers: { Authorization: `Bearer ${token}` } });
          setStats(statsRes.data);
        } catch (e) { console.warn('Stats fetch failed'); }

        try {
          const orderRes = await axios.get('https://ironforge-gym-shop.onrender.com/api/orders', { headers: { Authorization: `Bearer ${token}` } });
          setOrders(orderRes.data.reverse());
        } catch (e) { console.warn('Orders fetch failed'); }

        try {
          const msgRes = await axios.get('https://ironforge-gym-shop.onrender.com/api/messages', { headers: { Authorization: `Bearer ${token}` } });
          setMessages(msgRes.data);
        } catch (e) { console.warn('Messages fetch failed'); }

        setLoading(false);
      } catch (err) {
        console.error('Core data fetch failed', err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token, isAdmin, navigate]);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`https://ironforge-gym-shop.onrender.com/api/products/${currentProduct.id}`, currentProduct, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('https://ironforge-gym-shop.onrender.com/api/products', currentProduct, { headers: { Authorization: `Bearer ${token}` } });
      }
      const res = await axios.get('https://ironforge-gym-shop.onrender.com/api/products');
      setProducts(res.data);
      setIsEditing(false);
      setCurrentProduct({ name: '', price: '', category: 'equipment', image: '', description: '', stock: 0 });
    } catch (err) { console.error(err); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`https://ironforge-gym-shop.onrender.com/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await axios.put(`https://ironforge-gym-shop.onrender.com/api/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) { console.error(err); }
  };

  const handleOrderDelete = async (id) => {
    if (!window.confirm('Permanently delete this order record?')) return;
    try {
      await axios.delete(`https://ironforge-gym-shop.onrender.com/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(orders.filter(o => o.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="page"><div className="container"><div className="spinner" /></div></div>;

  const newOrdersCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="page">
      <div className="container">
        <div className="admin-header">
          <div>
            <div className="section-tag">ADMIN PANEL</div>
            <h1 className="section-title">Dashboard</h1>
          </div>
          <div className="admin-tabs">
            <button className={`tab-btn ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>Overview</button>
            <button className={`tab-btn ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>Products</button>
            <button className={`tab-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
              Orders {newOrdersCount > 0 && <span className="admin-badge">{newOrdersCount}</span>}
            </button>
            <button className={`tab-btn ${tab === 'messages' ? 'active' : ''}`} onClick={() => setTab('messages')}>
              Messages {messages.length > 0 && <span className="admin-badge">{messages.length}</span>}
            </button>
          </div>
        </div>

        {/* Global Alert Notification */}
        {(newOrdersCount > 0 || messages.length > 0) && (
          <div className="admin-global-alert animate-in">
            <Bell size={18} />
            <span>You have <strong>{newOrdersCount}</strong> new orders and <strong>{messages.length}</strong> customer messages to review!</span>
          </div>
        )}

        {tab === 'stats' && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><DollarSign size={24} /></div>
              <div className="stat-info">
                <span>Revenue</span>
                <strong>${stats.revenue.toFixed(2)}</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><ShoppingCart size={24} /></div>
              <div className="stat-info">
                <span>Total Orders</span>
                <strong>{stats.totalOrders}</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Package size={24} /></div>
              <div className="stat-info">
                <span>Products</span>
                <strong>{stats.totalProducts}</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Users size={24} /></div>
              <div className="stat-info">
                <span>Users</span>
                <strong>{stats.totalUsers}</strong>
              </div>
            </div>
          </div>
        )}

        {tab === 'products' && (
          <div className="admin-content">
            <div className="card product-form-card">
              <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
              <form onSubmit={handleProductSubmit} className="admin-form">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input className="form-input" value={currentProduct.name} onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price</label>
                    <input type="number" step="0.01" className="form-input" value={currentProduct.price} onChange={e => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })} required />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={currentProduct.category} onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}>
                      <option value="equipment">Equipment</option>
                      <option value="supplements">Supplements</option>
                      <option value="apparel">Apparel</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input type="number" className="form-input" value={currentProduct.stock} onChange={e => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input className="form-input" value={currentProduct.image} onChange={e => setCurrentProduct({ ...currentProduct, image: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows="3" value={currentProduct.description} onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })} required />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{isEditing ? 'Update Product' : 'Add Product'}</button>
                  {isEditing && <button type="button" className="btn btn-outline" onClick={() => { setIsEditing(false); setCurrentProduct({ name: '', price: '', category: 'equipment', image: '', description: '', stock: 0 }); }}>Cancel</button>}
                </div>
              </form>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="table-prod">
                          <img src={p.image} alt="" />
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-primary">{p.category}</span></td>
                      <td>${p.price.toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <div className="table-actions">
                          <button className="icon-btn" onClick={() => { setIsEditing(true); setCurrentProduct(p); }}><Edit2 size={16} /></button>
                          <button className="icon-btn delete" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>
                      <div className="table-user">
                        <strong>{o.userName}</strong>
                        <span>{o.userEmail}</span>
                      </div>
                    </td>
                    <td>${Number(o.total).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${o.status === 'delivered' ? 'badge-success' : o.status === 'cancelled' ? 'badge-error' : 'badge-warning'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn success" title="Mark Delivered" onClick={() => handleUpdateOrderStatus(o.id, 'delivered')}><CheckCircle size={16} /></button>
                        <button className="icon-btn warning" title="Mark Processing" onClick={() => handleUpdateOrderStatus(o.id, 'processing')}><Clock size={16} /></button>
                        <button className="icon-btn error" title="Cancel Order" onClick={() => handleUpdateOrderStatus(o.id, 'cancelled')}><XCircle size={16} /></button>
                        <button className="icon-btn delete" title="Delete Record" onClick={() => handleOrderDelete(o.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'messages' && (
          <div className="messages-list">
            {messages.length === 0 ? (
              <div className="card text-center" style={{ padding: 60 }}>
                <MessageSquare size={48} color="var(--text3)" style={{ marginBottom: 16 }} />
                <h3>No messages yet</h3>
                <p>When customers contact you from the Support page, they will appear here.</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className="card message-card animate-in">
                  <div className="message-header">
                    <div>
                      <strong>{msg.name}</strong>
                      <span>{msg.email}</span>
                    </div>
                    <span className="badge badge-primary">{msg.reason}</span>
                    <small>{new Date(msg.date).toLocaleString()}</small>
                  </div>
                  <div className="message-body">
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function XCircle({ size }) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>; }

