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
app.use(session({
  secret: 'votre_secret_key', // Changez ceci par une clé secrète forte
  resave: false,
  saveUninitialized: true
}));

// Fonction pour récupérer les détails d'un film par son ID
async function getMovieDetailsById(id) {
  try {
    const response = await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=e9025ee9`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du film:", error);
    // Gérez l'erreur en conséquence (vous pourriez renvoyer un objet vide, par exemple)
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

  try {
    // Effectuer une requête à l'API OMDB pour récupérer les résultats de recherche
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

// Route pour gérer les favoris
app.post("/favorites/:id", (req, res) => {
  const { id } = req.params;
  let favorites = req.session.favorites || [];

  // Ajoutez l'ID du film aux favoris s'il n'est pas déjà présent
  if (!favorites.includes(id)) {
    favorites.push(id);
    req.session.favorites = favorites;
  }

  res.redirect(`/film/${id}`);
});

// Route pour afficher les détails d'un film
app.get("/film/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Utilisez la fonction pour récupérer les détails du film
    const filmDetails = await getMovieDetailsById(id);

    // Rendre le fichier film.ejs avec les détails du film
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
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});