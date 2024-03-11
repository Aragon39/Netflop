const axios = require("axios");
const express = require("express");

const app = express();
const port = 3000;

// Route pour rechercher des films par titre
app.get("/search", async (req, res) => {
    const searchTerm = req.query.q; // Récupère le terme de recherche depuis les paramètres de requête
    try {
        const response = await axios.get(`http://www.omdbapi.com/?s=${searchTerm}&apikey=e9025ee9`);
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de la recherche de films:", error);
        res.status(500).json({ error: "Erreur lors de la recherche de films" });
    }
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home"); // Rendre le fichier home.ejs
});


app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});