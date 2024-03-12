const axios = require("axios");
const express = require("express");
const session = require("express-session");

const app = express();
const port = 3000;

app.use(session({
    secret: "votre_secret_key",
    resave: false,
    saveUninitialized: true
}));

// Configuration du moteur de vue EJS
app.set("view engine", "ejs");

// Middleware pour servir les fichiers statiques (images)
app.use(express.static("public"));

// Route pour afficher la page d'accueil
app.get("/", (req, res) => {
    res.render("home"); // Rendre le fichier home.ejs
});

// Route pour rechercher des films par titre
app.get("/search", async (req, res) => {
    const searchTerm = req.query.q; // Récupère le terme de recherche depuis les paramètres de requête
    req.session.searchTerm = searchTerm; // Stocker le terme de recherche dans la session
    const page = parseInt(req.query.page) || 1; // Numéro de page, par défaut à la première page
    const limit = 10; // Nombre de résultats par page

    try {
        // Effectuer une requête à l'API OMDB pour récupérer les résultats de recherche
        const response = await axios.get(`http://www.omdbapi.com/?s=${searchTerm}&apikey=e9025ee9&page=${page}`);
        const movies = response.data.Search; // Récupérer la liste des films à partir de la réponse de l'API

        // Vérifie si des films ont été retournés par l'API
        if (movies && movies.length > 0) {
            const totalResults = parseInt(response.data.totalResults);
            const totalPages = Math.ceil(totalResults / limit); // Calculer le nombre total de pages

            // Rendre le fichier search.ejs avec les données des films
            res.render("search", { movies: movies, searchTerm: searchTerm, currentPage: page, totalPages: totalPages });
        } else {
            // Si aucun film n'a été trouvé, rendre une vue avec un message indiquant aucun résultat trouvé
            res.render("no-results", { searchTerm: searchTerm });
        }
    } catch (error) {
        console.error("Erreur lors de la recherche de films :", error);
        res.status(500).json({ error: "Erreur lors de la recherche de films" });
    }
});

// Route pour afficher les détails d'un film par son identifiant IMDB
app.get("/movie/:imdbId", async (req, res) => {
    const imdbId = req.params.imdbId;
    const searchTerm = req.session.searchTerm; // Récupérer le terme de recherche depuis la session

    try {
        // Effectuer une requête à l'API OMDB pour récupérer les détails du film par son identifiant IMDB
        const response = await axios.get(`http://www.omdbapi.com/?i=${imdbId}&apikey=e9025ee9`);
        const movieDetails = response.data; // Récupérer les détails du film depuis la réponse de l'API

        // Rendre le fichier details.ejs avec les détails du film et le terme de recherche
        res.render("details", { movie: movieDetails, searchTerm: searchTerm });
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du film :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des détails du film" });
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
