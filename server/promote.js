import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const UserSchema = new mongoose.Schema({
  email: String,
  role: String
});
const User = mongoose.model('User', UserSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const result = await User.updateMany(
      { email: { $regex: /^(umarxgamer04@gmail.com|onetaphero0@gmail.com)$/i } },
      { role: 'admin' }
    );
    console.log(`✅ Success! Updated ${result.modifiedCount} accounts to Admin.`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
