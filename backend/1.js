import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

// Create admin user
const createAdminUser = async () => {
  try {
    // Define the admin user details
    const adminUser = {
      email: 'shaheer@bbc.com', // Replace with your admin email
      password: 'phase4',  // Replace with your admin password (hashed if necessary)
    };

    // Create and save the admin user
    const newAdmin = new Admin(adminUser);
    await newAdmin.save();
    console.log("Admin user created successfully");

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();
