import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

router.post('/add', async (req, res) => {
    try {
        console.log("📦 New product data:", req.body);
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();    
        console.log("✅ Product saved to MongoDB:", savedProduct);
        res.json({ message: "Product added", product: savedProduct });
    } catch (error) {
        console.error("❌ Error saving product:", error);
        res.status(500).json({ error: "Failed to add product" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const deleted = await Product.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

 // PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
  console.log("👉 Update request received for ID:", req.params.id);
console.log("📝 Data received:", req.body);

});

  

export default router;
