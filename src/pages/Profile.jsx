import { useState } from 'react';
import { User, Mail, Shield, LogOut, Package, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('info');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page">
      <div className="container">
        <div className="section-tag">MY ACCOUNT</div>
        <h1 className="section-title">Profile</h1>

        <div className="profile-layout">
          <aside className="profile-sidebar">
            <div className="profile-user-card">
              <div className="profile-avatar">{user.name[0]}</div>
              <div className="profile-user-info">
                <h3>{user.name}</h3>
                <span>{user.email}</span>
                {isAdmin && <span className="badge badge-primary"><Shield size={10} /> Administrator</span>}
              </div>
            </div>
            <nav className="profile-nav">
              <button className={`profile-nav-btn ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>
                <User size={18} /> Account Info
              </button>
              <Link to="/orders" className="profile-nav-btn">
                <Package size={18} /> My Orders
              </Link>
              {isAdmin && (
                <Link to="/admin" className="profile-nav-btn admin-nav">
                  <Settings size={18} /> Admin Dashboard
                </Link>
              )}
              <button className="profile-nav-btn logout" onClick={handleLogout}>
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </aside>

          <main className="profile-content">
            {tab === 'info' && (
              <div className="card">
                <h3>Personal Information</h3>
                <div className="divider" />
                <div className="profile-details">
                  <div className="detail-row">
                    <div className="detail-label">Full Name</div>
                    <div className="detail-value">{user.name}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Email Address</div>
                    <div className="detail-value">{user.email}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Account Role</div>
                    <div className="detail-value" style={{ textTransform: 'capitalize' }}>{user.role}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Member Since</div>
                    <div className="detail-value">October 2023</div>
                  </div>
                </div>
                <button className="btn btn-outline" style={{ marginTop: '24px' }} disabled>Edit Profile</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
