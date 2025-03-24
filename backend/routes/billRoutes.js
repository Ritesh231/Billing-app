// backend/routes/billRoutes.js
import express from 'express';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';
import Bill from '../models/Bill.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/generate', async (req, res) => {
    const { customerName, items } = req.body;

    console.log("📥 Received Bill Data:");
    console.log("Customer Name:", customerName);
    console.log("Items:", items);


    const doc = new PDFDocument();
    const fileName = `bill-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '..', 'bills', fileName);

    let total = 0;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(22).text("FASHION BRAND", { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(14).text(`Customer: ${customerName}`);
    doc.moveDown();
    doc.fontSize(14).text("Items Purchased:");
    doc.moveDown();

    // Items
    doc.fontSize(12);
    items.forEach((item, i) => {
        const price = parseFloat(item.price);
        const quantity = parseInt(item.quantity);
        const subtotal = price * quantity;
        total += subtotal;

        doc.text(`${i + 1}. ${item.name} - ${price} x ${quantity} = ${subtotal}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: ${total}`);

    doc.end();

    // ✅ Save to MongoDB
    const newBill = new Bill({
        items,
        total
    });

    try {
        await newBill.save();
    } catch (error) {
        console.error("Error saving bill:", error);
    }

    stream.on('finish', () => {
        res.download(filePath, fileName);
    });
});

export default router;
