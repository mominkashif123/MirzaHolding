import express from "express";
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import quarterReportRoutes from './routes/quarterReportRoutes.js';
import fundRoutes from './routes/fundRoutes.js';
import adminFundRoutes from './routes/adminFundRoutes.js';
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

// Connect to MongoDB (no fund seed – admin creates funds)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {})
  .catch((err) => {
    // Error connecting to MongoDB
  });

const app = express();

// Middleware
// Increase payload size limit for PDF uploads (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
app.use("/api", quarterReportRoutes);
app.use("/api", fundRoutes);
app.use("/api", adminFundRoutes);

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
  // Server is running
});

export default app;
