import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Truck, Star, ChevronRight, Play, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import './Home.css';

const FEATURES = [
  { icon: <Truck size={28} />, title: 'Free Shipping', desc: 'On all orders over $75. Fast delivery to your door.' },
  { icon: <Shield size={28} />, title: '2-Year Warranty', desc: 'All equipment backed by our ironclad guarantee.' },
  { icon: <Zap size={28} />, title: 'Expert Support', desc: '24/7 fitness & product support from our team.' },
  { icon: <Star size={28} />, title: 'Top Rated', desc: 'Rated #1 gym shop by 50,000+ satisfied customers.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setFeatured(res.data.slice(0, 8)))
      .catch(() => {});
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-text">
            <div className="section-tag">
              <span className="dot" /> THE ELITE COLLECTION 2024
            </div>
            <h1 className="hero-title">
              EVOLVE YOUR<br />
              <span className="text-primary">STRENGTH</span>
            </h1>
            <p className="hero-subtitle">
              Premium grade equipment for those who refuse to settle. Join 50,000+ athletes forging their destiny with IronForge.
            </p>
            <div className="hero-btns">
              <Link to="/shop" className="btn btn-primary btn-lg">
                Explore Shop <ArrowRight size={20} />
              </Link>
              <button className="btn-play" onClick={() => setShowVideo(true)}>
                <div className="play-icon"><Play size={16} fill="currentColor" /></div>
                <span>Watch Brand Story</span>
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card c1">
              <ShoppingBag size={24} />
              <div><strong>New Arrival</strong><span>Dumbbell Set</span></div>
            </div>
            <div className="floating-card c2">
              <Star size={20} fill="var(--primary)" color="var(--primary)" />
              <div><strong>4.9/5 Rating</strong><span>from 2K reviews</span></div>
            </div>
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" alt="Athlete" />
          </div>
        </div>
      </section>

      {/* Video Modal Overlay */}
      {showVideo && (
        <div className="video-modal-overlay" onClick={() => setShowVideo(false)}>
          <div className="video-modal-content" onClick={e => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setShowVideo(false)}>
              <X size={24} />
            </button>
            <div className="video-responsive">
              <iframe
                width="853"
                height="480"
                src={`https://www.youtube.com/embed/v7AYKMP6rOE?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="IronForge Brand Story"
              />
            </div>
          </div>
        </div>
      )}

      {/* Categories Bento Grid */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">CATEGORIES</div>
            <h2 className="section-title">Everything You Need to <span className="text-primary">Train</span></h2>
          </div>
          
          <div className="bento-grid">
            <Link to="/shop?cat=equipment" className="bento-item equipment large">
              <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&q=80" alt="Equipment" />
              <div className="bento-content">
                <span className="bento-tag">High Performance</span>
                <h3>Equipment</h3>
                <p>Barbells, racks & multi-gyms</p>
                <div className="bento-link">Browse All <ChevronRight size={18} /></div>
              </div>
            </Link>
            
            <Link to="/shop?cat=supplements" className="bento-item supplements">
              <img src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80" alt="Supplements" />
              <div className="bento-content">
                <h3>Supplements</h3>
                <p>Protein & Recovery</p>
              </div>
            </Link>
            
            <Link to="/shop?cat=apparel" className="bento-item apparel">
              <img src="https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80" alt="Apparel" />
              <div className="bento-content">
                <h3>Apparel</h3>
                <p>Performance Wear</p>
              </div>
            </Link>
            
            <div className="bento-item promo">
              <div className="promo-inner">
                <h4>Newsletter</h4>
                <p>Get 10% off your next order</p>
                <div className="promo-input">
                  <input type="email" placeholder="Email Address" />
                  <button><ArrowRight size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar">
        <div className="container">
          <div className="features-inner">
            {FEATURES.map((f, i) => (
              <div className="feature-item" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-text">
                  <strong>{f.title}</strong>
                  <span>{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-tag">BESTSELLERS</div>
              <h2 className="section-title">Forge Your <span className="text-primary">Success</span></h2>
            </div>
            <Link to="/shop" className="btn btn-outline">View Collection <ArrowRight size={18} /></Link>
          </div>
          <div className="grid-4">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>READY TO START YOUR <span className="text-primary">TRANSFORMATION?</span></h2>
              <p>Join the IronForge community and get exclusive access to training programs and early product drops.</p>
              <Link to="/register" className="btn btn-primary btn-lg">Create Account Now</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

