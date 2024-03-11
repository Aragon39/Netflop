const axios = require("axios");
const express = require("express");

const app = express();
const port = 3000;

// Configuration du moteur de vue EJS
app.set("view engine", "ejs");

// Route pour afficher la page d'accueil
app.get("/", (req, res) => {
    res.render("home"); // Rendre le fichier home.ejs
});

// Route pour rechercher des films par titre
app.get("/search", async (req, res) => {
    const searchTerm = req.query.q; // Récupère le terme de recherche depuis les paramètres de requête
    const page = parseInt(req.query.page) || 1; // Numéro de page, par défaut à la première page
    const limit = 10; // Nombre de résultats par page

    try {
        // Effectuer une requête à l'API OMDB pour récupérer les résultats de recherche
        const response = await axios.get(`http://www.omdbapi.com/?s=${searchTerm}&apikey=e9025ee9&page=${page}`);
        const movies = response.data.Search; // Récupérer la liste des films à partir de la réponse de l'API
        const totalResults = parseInt(response.data.totalResults);
        const totalPages = Math.ceil(totalResults / limit); // Calculer le nombre total de pages

        // Rendre le fichier search.ejs avec les données des films
        res.render("search", { movies: movies, searchTerm: searchTerm, currentPage: page, totalPages: totalPages });
    } catch (error) {
        console.error("Erreur lors de la recherche de films:", error);
        res.status(500).json({ error: "Erreur lors de la recherche de films" });
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
