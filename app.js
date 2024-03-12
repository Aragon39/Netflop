// Importation des modules
const express = require("express");
const axios = require("axios");
const session = require("express-session");

// Configuration d'Express
const app = express();
const port = 3000;

// Configuration du moteur de vue EJS
app.set("view engine", "ejs");

// Middleware pour servir les fichiers statiques (images)
app.use(express.static("public"));

// Middleware pour traiter les données du formulaire
app.use(express.urlencoded({ extended: true }));

// Configuration de express-session
app.use(
  session({
    secret: "votre_secret_key",
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

// Page d'accueil
app.get("/", (req, res) => {
  res.render("home");
});

// Recherche de films
app.get("/search", async (req, res) => {
  const searchTerm = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;

  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?s=${searchTerm}&apikey=e9025ee9`
    );
    const movies = response.data.Search;
    const totalResults = parseInt(response.data.totalResults);
    const totalPages = Math.ceil(totalResults / limit);

    res.render("search", {
      movies: movies,
      searchTerm: searchTerm,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Erreur lors de la recherche de films:", error);
    res.status(500).json({ error: "Erreur lors de la recherche de films" });
  }
});

// Page des favoris
app.get("/favorites", async (req, res) => {
  const favorites = req.session.favorites || [];
  const favoriteMovies = await Promise.all(
    favorites.map(async (movieId) => {
      const movieDetails = await getMovieDetailsById(movieId);
      return movieDetails;
    })
  );

  res.render("favorites", { favorites: favoriteMovies });
});

// Détails d'un film
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

// Ajout d'un film aux favoris
app.post("/add-to-favorites/:id", (req, res) => {
  const { id } = req.params;
  const favorites = req.session.favorites || [];

  if (!favorites.includes(id)) {
    favorites.push(id);
    req.session.favorites = favorites;
    res.json({ success: true, message: "Film ajouté aux favoris !" });
  } else {
    res.json({ success: false, message: "Ce film est déjà dans vos favoris." });
  }
});

// Suppression d'un film des favoris
app.get("/remove-from-favorites/:id", (req, res) => {
  const { id } = req.params;
  let favorites = req.session.favorites || [];

  if (favorites.includes(id)) {
    favorites = favorites.filter((movieId) => movieId !== id);
    req.session.favorites = favorites;
    res.json({ success: true, message: "Film retiré des favoris !" });
  } else {
    res.json({
      success: false,
      message: "Ce film n'est pas dans vos favoris.",
    });
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
