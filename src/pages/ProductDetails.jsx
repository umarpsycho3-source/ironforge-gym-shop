import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, Shield, ArrowLeft, Send } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        const p = res.data.find(item => item.id == id);
        setProduct(p);
        setLoading(false);
      });
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to leave a review');
    setSubmitting(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/products/${id}/reviews`, {
        user: user.name,
        ...newReview
      });
      setProduct({
        ...product,
        reviews: [...(product.reviews || []), res.data],
        rating: ((product.rating * (product.reviews?.length || 0)) + newReview.rating) / ((product.reviews?.length || 0) + 1)
      });
      setNewReview({ rating: 5, comment: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page container"><div className="spinner" /></div>;
  if (!product) return <div className="page container"><h2>Product not found</h2><Link to="/shop">Back to Shop</Link></div>;

  return (
    <div className="page">
      <div className="container">
        <Link to="/shop" className="back-link"><ArrowLeft size={16} /> Back to Shop</Link>
        
        <div className="product-details-grid">
          <div className="product-details-image">
            <img src={product.image} alt={product.name} />
          </div>
          
          <div className="product-details-info">
            <div className="section-tag">{product.category}</div>
            <h1>{product.name}</h1>
            <div className="product-rating-overview">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "var(--primary)" : "none"} color="var(--primary)" />
                ))}
              </div>
              <span>({product.reviews?.length || 0} Customer Reviews)</span>
            </div>
            
            <div className="product-details-price">${product.price.toFixed(2)}</div>
            <p className="product-details-desc">{product.description}</p>
            
            <div className="product-details-meta">
              <div className="meta-item"><Truck size={20} /> <span>Free Shipping on orders over $75</span></div>
              <div className="meta-item"><Shield size={20} /> <span>2-Year Warranty Included</span></div>
            </div>
            
            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '32px' }}>
              Add to Cart
            </button>
          </div>
        </div>

        <div className="product-reviews-section">
          <h2>Customer <span className="text-primary">Reviews</span></h2>
          
          <div className="reviews-layout">
            <div className="reviews-list">
              {product.reviews?.length > 0 ? (
                product.reviews.map(r => (
                  <div key={r.id} className="review-card">
                    <div className="review-header">
                      <strong>{r.user}</strong>
                      <span className="review-date">{r.date}</span>
                    </div>
                    <div className="stars">
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </div>
                    <p>{r.comment}</p>
                  </div>
                ))
              ) : (
                <p className="no-reviews">No reviews yet. Be the first to review!</p>
              )}
            </div>

            <div className="review-form-card card">
              <h3>Leave a Review</h3>
              {user ? (
                <form onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <select className="form-input" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: e.target.value})}>
                      <option value="5">5 Stars - Excellent</option>
                      <option value="4">4 Stars - Very Good</option>
                      <option value="3">3 Stars - Good</option>
                      <option value="2">2 Stars - Fair</option>
                      <option value="1">1 Star - Poor</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Comment</label>
                    <textarea className="form-input" rows="4" value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} placeholder="Share your thoughts..." required />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : <><Send size={16} /> Post Review</>}
                  </button>
                </form>
              ) : (
                <div className="login-prompt">
                  <p>Please log in to share your experience with this product.</p>
                  <Link to="/login" className="btn btn-outline">Login Now</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
