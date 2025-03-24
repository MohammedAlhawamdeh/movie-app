const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/userModel');

const path = require('path');
// Load environment variables from server directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// Function to create admin user
async function createAdminUser(adminData) {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const admin = await User.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      isAdmin: true,
    });

    console.log('Admin user created successfully:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Get admin details from command line arguments or use defaults
const adminData = {
  name: process.argv[2] || 'Admin User',
  email: process.argv[3] || 'admin@example.com',
  password: process.argv[4] || 'admin123',
};

console.log('Creating admin user with:', {
  name: adminData.name,
  email: adminData.email,
  password: '********'
});

// Create admin user
createAdminUser(adminData);