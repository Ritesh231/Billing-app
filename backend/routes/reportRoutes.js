import express from 'express';
import Product from '../models/Product.js';
import Invoice from '../models/Bill.js';

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalInvoices = await Invoice.countDocuments();

    const products = await Product.find();
    const lowStockItems = products.filter(p => p.stock < 5).length;

    const invoices = await Invoice.find();
    const totalRevenue = invoices.reduce((acc, invoice) => acc + invoice.total, 0);

    const productsByCategory = {};
    products.forEach(p => {
      const cat = p.category || "Uncategorized";
      productsByCategory[cat] = (productsByCategory[cat] || 0) + 1;
    });

    const monthlyRevenue = {};
    invoices.forEach(inv => {
      const date = new Date(inv.date || inv.createdAt);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + inv.total;
    });

    res.json({
      totalProducts,
      totalInvoices,
      totalRevenue,
      lowStockItems,
      productsByCategory,
      monthlyRevenue
    });
  } catch (err) {
    console.error("Error fetching report summary:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
