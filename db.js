const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

async function initDB() {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Create Tables
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT,
            email TEXT UNIQUE,
            telephone TEXT,
            mot_de_passe TEXT
        );

        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT,
            phone TEXT,
            address TEXT,
            items TEXT,
            total_price INTEGER,
            payment_method TEXT,
            status TEXT DEFAULT 'nouveau',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT,
            prix INTEGER,
            categorie TEXT,
            image TEXT
        );
    `);

    console.log("Database initialized at " + dbPath);
    return db;
}

module.exports = { initDB };