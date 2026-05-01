import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const UserSchema = new mongoose.Schema({ email: String, role: String, name: String });
const User = mongoose.model('User', UserSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find();
    console.log('--- ALL USERS ---');
    users.forEach(u => console.log(`${u.name} | ${u.email} | ${u.role}`));
    console.log('-----------------');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
