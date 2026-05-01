import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Dumbbell, Menu, X, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <Dumbbell size={28} />
          <span>IRON<strong>FORGE</strong></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={() => setMenuOpen(false)} end>Home</NavLink>
          <NavLink to="/shop" onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <NavLink to="/support" onClick={() => setMenuOpen(false)}>Support</NavLink>
          {user && <NavLink to="/orders" onClick={() => setMenuOpen(false)}>My Orders</NavLink>}
          {isAdmin && <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="admin-link"><Shield size={14} />Admin</NavLink>}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn" id="cart-icon">
            <ShoppingCart size={20} />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-btn" id="user-menu-btn">
                <User size={18} />
                <span>{user.name.split(' ')[0]}</span>
              </button>
              <div className="user-dropdown">
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  <User size={14} /> Profile
                </Link>
                <button onClick={handleLogout}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" id="login-btn">Login</Link>
          )}

          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} id="mobile-menu-btn">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
