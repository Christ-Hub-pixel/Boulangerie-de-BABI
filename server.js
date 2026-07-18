require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Pour parser le JSON
app.use(express.urlencoded({ extended: true }));

// On sert tous les fichiers de la racine (HTML, CSS, images) comme fichiers statiques
app.use(express.static(__dirname));

// Route de base (API Check)
app.get('/api/status', (req, res) => {
    res.json({ status: 'API is running', version: '1.0.0' });
});

// Par défaut, toute route non définie (côté backend) renvoie vers index.html
// Ceci est utile si vous tapez une mauvaise URL, ça vous ramène à l'accueil
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
