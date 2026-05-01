import { Link } from 'react-router-dom';
import { Dumbbell, Camera, MessageCircle, Video, Mail, Phone, MapPin, Share2 } from 'lucide-react';
import { useState } from 'react';
import Modal from './Modal';
import './Footer.css';

export default function Footer() {
  const [modalType, setModalType] = useState(null);

  const renderModalContent = () => {
    switch (modalType) {
      case 'privacy':
        return (
          <>
            <h3>Data Protection</h3>
            <p>At IRONFORGE, we respect your privacy like we respect the heavy weights. Your personal data is encrypted and never shared with 3rd parties without your explicit consent.</p>
            <h3>How We Use Info</h3>
            <p>We use your data to process orders, personalize your training experience, and send you exclusive IRONFORGE drops if you're opted into our newsletter.</p>
          </>
        );
      case 'terms':
        return (
          <>
            <h3>Usage Policy</h3>
            <p>By using IRONFORGE, you agree to treat our community with respect. We reserve the right to cancel orders that appear fraudulent or violate our fair-use policy.</p>
            <h3>Product Liability</h3>
            <p>Training involves risk. While we provide premium equipment, IRONFORGE is not responsible for injuries resulting from improper use of products or excessive PR attempts.</p>
          </>
        );
      case 'social':
        return (
          <div className="social-hub">
            <div className="social-item">
              <div className="social-icon-large ig"><Camera size={32} /></div>
              <div className="social-details">
                <strong>Instagram</strong>
                <span>@ironforge_gym</span>
              </div>
              <button className="btn btn-sm btn-primary">Follow</button>
            </div>
            <div className="social-item">
              <div className="social-icon-large tw"><MessageCircle size={32} /></div>
              <div className="social-details">
                <strong>Twitter / X</strong>
                <span>@ironforge_fitness</span>
              </div>
              <button className="btn btn-sm btn-primary">Follow</button>
            </div>
            <div className="social-item">
              <div className="social-icon-large yt"><Video size={32} /></div>
              <div className="social-details">
                <strong>YouTube</strong>
                <span>IronForge Official</span>
              </div>
              <button className="btn btn-sm btn-primary">Subscribe</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <Dumbbell size={26} />
              <span>IRON<strong>FORGE</strong></span>
            </div>
            <p>Your #1 destination for premium gym equipment, supplements, and athletic apparel. Forge your best body.</p>
            <div className="footer-social">
              <button onClick={() => setModalType('social')} className="social-btn" data-tooltip="Instagram"><Camera size={18} /></button>
              <button onClick={() => setModalType('social')} className="social-btn" data-tooltip="Twitter"><MessageCircle size={18} /></button>
              <button onClick={() => setModalType('social')} className="social-btn" data-tooltip="YouTube"><Video size={18} /></button>
              <button onClick={() => setModalType('social')} className="social-btn" data-tooltip="Facebook"><Share2 size={18} /></button>
            </div>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/shop?cat=equipment">Equipment</Link>
            <Link to="/shop?cat=supplements">Supplements</Link>
            <Link to="/shop?cat=apparel">Apparel</Link>
            <Link to="/shop">All Products</Link>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/cart">Cart</Link>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <span><Mail size={14} /> umarxgamer04@gmail.com</span>
            <span><Phone size={14} /> +94 77 181 3023</span>
            <span><MapPin size={14} /> Srilanka, Kandy, Ulapane</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} IronForge Gym Shop. All rights reserved.</p>
          <div className="footer-bottom-links">
            <button className="footer-modal-btn" onClick={() => setModalType('privacy')}>Privacy Policy</button>
            <button className="footer-modal-btn" onClick={() => setModalType('terms')}>Terms of Service</button>
            <button className="footer-modal-btn" onClick={() => setModalType('shipping')}>Shipping Info</button>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={!!modalType} 
        onClose={() => setModalType(null)} 
        title={modalType === 'privacy' ? 'Privacy Policy' : modalType === 'terms' ? 'Terms of Service' : 'Shipping Info'}
      >
        {renderModalContent()}
      </Modal>
    </footer>
  );
}
