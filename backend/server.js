// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js'; // ✅
import billRoutes from './routes/billRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log("🔥 Incoming request:", req.method, req.url);
    next();
});


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/billing-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Use routes
app.use('/api/products', productRoutes); // ✅

app.use('/api/bills', billRoutes); // ✅ This is critical
app.use('/api/dashboard', dashboardRoutes);

app.use('/api/reports', reportRoutes);


app.listen(5000, () => {
    console.log("✅ Server running on port 5000");
});
