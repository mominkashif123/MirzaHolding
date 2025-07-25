import express from "express";
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  'https://mirza-holding.vercel.app',
  'http://localhost:3000',  // Add localhost to allowed origins
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // This allows cookies to be sent across domains
}));

// Routes
app.use("/api", userRoutes);
app.use("/api", adminRoutes);

app.get("/api/psx", async (req, res) => {
  const symbols = ['KSE100', 'KEL', 'PSO', 'OGDC', 'KSE30']; 
  const results = {};

  await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const response = await fetch(`https://dps.psx.com.pk/timeseries/int/${symbol}`);
        const data = await response.json();

        if (data.status === 1 && data.data?.length > 0) {
          const latest = data.data[data.data.length - 1];
          results[symbol] = {
            price: latest[1],
            time: new Date(latest[0] * 1000).toLocaleString(),
          };
        } else {
          results[symbol] = null;
        }
      } catch (error) {
        results[symbol] = null;
      }
    })
  );

  res.json(results);
});

// Define the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
