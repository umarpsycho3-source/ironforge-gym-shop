import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    seedDatabase();
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const schemaOptions = {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
};

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
}, schemaOptions);

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  description: String,
  stock: Number,
  rating: { type: Number, default: 0 },
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    date: String
  }]
}, schemaOptions);

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  userEmail: String,
  items: Array,
  total: Number,
  status: { type: String, default: 'pending' },
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now }
}, schemaOptions);

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  reason: String,
  message: String,
  date: { type: Date, default: Date.now }
}, schemaOptions);

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const Message = mongoose.model('Message', MessageSchema);

// ─── Seed Logic ───────────────────────────────────────
async function seedDatabase() {
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log('🌱 Seeding products from JSON...');
    const productsPath = path.join(__dirname, 'data', 'products.json');
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      await Product.insertMany(products);
      console.log('✅ Seeding complete!');
    }
  }
}

// ─── Middleware ───────────────────────────────────────
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
};

// ─── Auth ─────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    const token = jwt.sign({ id: user._id, email, name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name, email, role: user.role } });
  } catch (err) { res.status(500).json({ error: 'Registration failed' }); }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (err) { res.status(500).json({ error: 'Login failed' }); }
});

// ─── Products ─────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/products', authenticate, isAdmin, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

app.put('/api/products/:id', authenticate, isAdmin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

app.delete('/api/products/:id', authenticate, isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ─── Orders ───────────────────────────────────────────
app.get('/api/orders', authenticate, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders);
    }
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch orders' }); }
});

app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const order = new Order({
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      items: req.body.items,
      total: Number(req.body.total),
      paymentMethod: req.body.paymentMethod,
      status: 'pending'
    });
    await order.save();
    res.json({ id: order._id });
  } catch (err) { res.status(500).json({ error: 'Failed to place order' }); }
});

app.put('/api/orders/:id/status', authenticate, isAdmin, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(order);
});

app.delete('/api/orders/:id', authenticate, isAdmin, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.put('/api/orders/:id/cancel', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'pending' && order.status !== 'processing') {
      return res.status(400).json({ error: 'Cannot cancel order in current status' });
    }
    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (err) { res.status(500).json({ error: 'Cancellation failed' }); }
});

// ─── Messages ─────────────────────────────────────────
app.get('/api/messages', authenticate, isAdmin, async (req, res) => {
  const messages = await Message.find().sort({ date: -1 });
  res.json(messages);
});

app.post('/api/messages', async (req, res) => {
  const message = new Message(req.body);
  await message.save();
  res.json(message);
});

// ─── Reviews ──────────────────────────────────────────
app.post('/api/products/:id/reviews', async (req, res) => {
  const { user, rating, comment } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    product.reviews.push({ user, rating: parseInt(rating), comment, date: new Date().toISOString().split('T')[0] });
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = parseFloat((totalRating / product.reviews.length).toFixed(1));
    
    await product.save();
    res.json(product.reviews[product.reviews.length - 1]);
  } catch (err) { res.status(500).json({ error: 'Review failed' }); }
});

// ─── Stats (admin) ────────────────────────────────────
app.get('/api/stats', authenticate, isAdmin, async (req, res) => {
  const orders = await Order.find();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();
  
  const activeOrders = orders.filter(o => o.status.toLowerCase() !== 'cancelled');
  const revenue = activeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  
  res.json({
    totalOrders: activeOrders.length,
    totalProducts: productsCount,
    totalUsers: usersCount,
    revenue
  });
});

app.listen(PORT, () => console.log(`🚀 Gym Shop Cloud API running on http://localhost:${PORT}`));
