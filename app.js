const express = require("express");
const axios = require("axios");
const session = require("express-session");

const app = express();
const port = 3000;

// Configuration du moteur de vue EJS
app.set("view engine", "ejs");

// Middleware pour servir les fichiers statiques (images)
app.use(express.static("public"));

// Configuration de express-session
app.use(
  session({
    secret: "votre_secret_key", // Changez ceci par une clé secrète forte
    resave: false,
    saveUninitialized: true,
  })
);

// Fonction pour récupérer les détails d'un film par son ID
async function getMovieDetailsById(id) {
  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?i=${id}&apikey=e9025ee9`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du film:", error);
    return {};
  }
}

// Route pour afficher la page d'accueil
app.get("/", (req, res) => {
  res.render("home"); // Rendre le fichier home.ejs
});

// Route pour rechercher des films par titre
app.get("/search", async (req, res) => {
  const searchTerm = req.query.q;
  const page = parseInt(req.query.page) || 1; // Numéro de page, par défaut à la première page
  const limit = 10; // Nombre de résultats par page

  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?s=${searchTerm}&apikey=e9025ee9`
    );

    const movies = response.data.Search;
    res.render("search", { movies: movies });
  } catch (error) {
    console.error("Erreur lors de la recherche de films:", error);
    res.status(500).json({ error: "Erreur lors de la recherche de films" });
  }
});

// Route pour afficher les favoris
app.get("/favorites", async (req, res) => {
  const favorites = req.session.favorites || [];

  // Récupérer les détails des films favoris de manière asynchrone
  const favoriteMovies = await Promise.all(
    favorites.map(async (movieId) => {
      const movieDetails = await getMovieDetailsById(movieId);
      return movieDetails;
    })
  );

  res.render("favorites", { favorites: favoriteMovies });
});
// Route pour afficher les détails d'un film
app.get("/film/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const filmDetails = await getMovieDetailsById(id);
    res.render("film", { film: filmDetails });
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du film:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des détails du film" });
  }
});

// Route pour afficher les favoris
app.get("/favorites", async (req, res) => {
  const favorites = req.session.favorites || [];
  res.render("favorites", { favorites });

  // (Facultatif) Affichez les informations des films dans la console
  favorites.forEach((favorite) => {
    console.log(`Film dans les favoris : ${favorite.details.Title}`);
    console.log(`ID du film : ${favorite.id}`);
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
