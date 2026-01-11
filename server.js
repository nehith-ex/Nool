const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock Database
let db = { products: [], scans: [] };

// AI Logic (Original Filename-based)
app.post('/api/analyze', (req, res) => {
    const { filename } = req.body;
    if (filename.toLowerCase().includes('handloom') || filename.toLowerCase().startsWith('h')) {
        res.json({ success: true, score: 98, pattern: { name: "Traditional Handloom Weave", type: "Hand-woven" } });
    } else {
        res.json({ success: false, score: 40 });
    }
});

// Create Product (Including new materials and origin)
app.post('/api/products/create', (req, res) => {
    const { weaver, item, materials, origin, ai_data } = req.body;
    const qr_string = "NOOL-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const newProduct = { qr_string, weaver, item, materials, origin, ai_data, timestamp: new Date() };
    db.products.push(newProduct);
    res.json({ product: newProduct });
});

// Verify Product (Direct Passport Logic)
app.post('/api/verify/scan', (req, res) => {
    const { qr_string } = req.body;
    const product = db.products.find(p => p.qr_string === qr_string);
    
    if (!product) return res.json({ status: 'fail' });

    const scanCount = db.scans.filter(s => s.qr_string === qr_string).length;
    db.scans.push({ qr_string, time: new Date() });

    res.json({
        status: scanCount === 0 ? 'success' : 'warning',
        product_details: product
    });
});

app.post('/api/admin/reset', (req, res) => {
    db = { products: [], scans: [] };
    res.json({ status: 'reset' });
});

app.listen(5003, () => console.log('🚀 SERVER STARTED ON PORT 5003!'));