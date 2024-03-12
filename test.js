// // Fonction pour récupérer les détails d'un film
// function getMovieDetails(movieTitle) {
//     // Effectuer une requête AJAX à l'API OMDB
//     fetch(`http://www.omdbapi.com/?t=${movieTitle}&apikey=e9025ee9`)
//         .then(response => response.json()) // Convertir la réponse en JSON
//         .then(data => {
//             // Afficher les détails du film dans la console
//             console.log("Détails du film :", data); 
//         })
//         .catch(error => {
//             console.error("Erreur lors de la récupération des détails du film :", error);
//         });
// }

// // Appel de la fonction avec le titre du film que vous souhaitez consulter
// getMovieDetails("Star Wars"); // Remplacez "Star Wars" par le titre du film que vous souhaitez consulter
