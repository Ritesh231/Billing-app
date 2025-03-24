// backend/routes/dashboardRoutes.js
import express from 'express';
import Product from '../models/Product.js';
import Bill from '../models/Bill.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const products = await Product.find();
        const lowStockItems = products.filter(product => product.stock < 5).length;

        const totalInvoices = await Bill.countDocuments();
        const bills = await Bill.find();

        const totalRevenue = bills.reduce((acc, bill) => acc + (bill.total || 0), 0);

        const stats = {
            totalProducts,
            totalInvoices,
            totalRevenue,
            lowStockItems
        };

        console.log("📊 Stats from backend:", stats); // ✅ Add console log here

        res.json(stats);
    } catch (error) {
        console.error("❌ Error fetching dashboard stats:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
