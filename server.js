require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

let db;

// Check API status
app.get('/api/status', (req, res) => {
    res.json({ status: 'API is running', version: '1.0.0' });
});

// --- PRODUCTS API ---

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await db.all("SELECT * FROM products ORDER BY id DESC");
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new product
app.post('/api/products', async (req, res) => {
    try {
        const { nom, prix, categorie, image } = req.body;
        if (!nom || !prix || !categorie) {
            return res.status(400).json({ error: "Nom, prix et catégorie obligatoires." });
        }
        const img = image || "assets/product_baguette.png";
        const result = await db.run(
            "INSERT INTO products (nom, prix, categorie, image) VALUES (?, ?, ?, ?)",
            [nom, prix, categorie, img]
        );
        res.status(201).json({ success: true, id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { nom, prix, categorie, image } = req.body;
        await db.run(
            "UPDATE products SET nom = ?, prix = ?, categorie = ?, image = ? WHERE id = ?",
            [nom, prix, categorie, image, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        await db.run("DELETE FROM products WHERE id = ?", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ORDERS API ---

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await db.all("SELECT * FROM orders ORDER BY created_at DESC");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new order
app.post('/api/orders', async (req, res) => {
    try {
        const { customer_name, phone, address, items, total_price, payment_method } = req.body;
        const result = await db.run(
            `INSERT INTO orders (customer_name, phone, address, items, total_price, payment_method, status)
             VALUES (?, ?, ?, ?, ?, ?, 'nouveau')`,
            [customer_name, phone, address, items, total_price, payment_method]
        );
        res.status(201).json({ success: true, order_id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update order status
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await db.run("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Track order by phone
app.get('/api/orders/track/:phone', async (req, res) => {
    try {
        const orders = await db.all("SELECT * FROM orders WHERE phone = ? ORDER BY created_at DESC", [req.params.phone]);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- USERS API ---

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await db.all("SELECT id, nom, email, telephone FROM users ORDER BY id DESC");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- STATS API ---

app.get('/api/stats', async (req, res) => {
    try {
        const orders = await db.all("SELECT * FROM orders");
        const productsCount = await db.get("SELECT COUNT(*) as count FROM products");
        const usersCount = await db.get("SELECT COUNT(*) as count FROM users");

        const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
        const newOrdersCount = orders.filter(o => o.status === 'nouveau').length;
        const deliveredOrdersCount = orders.filter(o => o.status === 'livre' || o.status === 'livré').length;
        const pendingOrdersCount = orders.filter(o => o.status === 'en preparation' || o.status === 'en livraison').length;

        res.json({
            totalRevenue,
            totalOrders: orders.length,
            newOrdersCount,
            deliveredOrdersCount,
            pendingOrdersCount,
            totalProducts: productsCount.count,
            totalUsers: usersCount.count
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve frontend SPA fallback
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Init DB and start server
initDB().then(database => {
    db = database;
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Erreur d'initialisation de la BD :", err);
});
