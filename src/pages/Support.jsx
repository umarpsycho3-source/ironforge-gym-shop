import { Mail, Phone, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import './Support.css';

export default function Support() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: 'order',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://ironforge-gym-shop.onrender.com/api/messages', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', reason: 'order', message: '' });
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="page container support-success">
        <div className="card text-center">
          <CheckCircle size={64} color="var(--success)" />
          <h2>Message Received!</h2>
          <p>Our team will get back to you within 24 hours at <strong>{formData.email}</strong>.</p>
          <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Send Another Message</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page container support-page">
      <div className="section-header">
        <div className="section-tag">SUPPORT HUB</div>
        <h1 className="section-title">How Can We <span className="text-primary">Help?</span></h1>
        <p className="section-subtitle">Whether it's an order query or training advice, the IronForge team is here for you.</p>
      </div>

      <div className="support-grid">
        <div className="support-info">
          <div className="support-card card">
            <div className="support-icon"><Mail size={24} /></div>
            <div>
              <h4>Email Us</h4>
              <p>umarxgamer04@gmail.com</p>
              <a href="mailto:umarxgamer04@gmail.com" className="support-link">Send Email</a>
            </div>
          </div>
          
          <div className="support-card card">
            <div className="support-icon whatsapp"><MessageSquare size={24} /></div>
            <div>
              <h4>WhatsApp Support</h4>
              <p>+94 77 181 3023</p>
              <a href="https://wa.me/94771813023" target="_blank" className="support-link">Chat Now</a>
            </div>
          </div>

          <div className="support-card card">
            <div className="support-icon"><Phone size={24} /></div>
            <div>
              <h4>Call Us</h4>
              <p>+94 77 181 3023</p>
              <span>Available 9AM - 6PM</span>
            </div>
          </div>
        </div>

        <div className="support-form-wrap card">
          <h3>Send a Message</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="John Doe" 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="john@example.com" 
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Reason for Contact</label>
              <select 
                className="form-input"
                value={formData.reason}
                onChange={e => setFormData({...formData, reason: e.target.value})}
              >
                <option value="order">Order Tracking</option>
                <option value="product">Product Question</option>
                <option value="training">Training Advice</option>
                <option value="complaint">Complaint</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Your Message</label>
              <textarea 
                className="form-input" 
                rows="5" 
                placeholder="How can we help you today?" 
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Send Message <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
