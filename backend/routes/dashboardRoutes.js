import express from 'express';
import Product from '../models/Product.js';
import Bill from '../models/Bill.js'; // Assuming you're saving bills in MongoDB

const router = express.Router();

router.get('/stats', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalInvoices = await Bill.countDocuments();
        
        const bills = await Bill.find();
        const totalRevenue = bills.reduce((sum, bill) => sum + (bill.total || 0), 0);

        const lowStockItems = await Product.countDocuments({ stock: { $lt: 5 } }); // Customize threshold

        const stats = {
            totalProducts,
            totalInvoices,
            totalRevenue,
            lowStockItems
        };

        console.log("📊 Stats from backend:", stats); // optional log
        res.json(stats);
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ error: 'Server error while fetching dashboard stats.' });
    }
});

export default router;
