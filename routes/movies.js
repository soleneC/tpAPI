var express = require('express');
const _ = require('lodash');
var router = express.Router();
const axios = require('axios');
const api_Key="97c9f291";


//on créé une fonction qui va récupérer les infos du film de l'api
function Informations_omdb(data, id = undefined){
	const i = _.uniqueId();


    const m ={
	id: id || i,
	movie: data.Title,
	yearOfRelease: parseInt(data.Year),
	duration: parseInt(data.Runtime),
	actors: data.Actors.split(", "),
	poster:data.Poster,
	boxOffice: parseInt(data.BoxOffice),
	rottenTomatoesScore:data.Ratings
};

return m;


}

function find(id){
	return movies.find((film)=> film.id ===id);
}


let movies = [{
  id: "0",
  movie: "Harry Potter and the Deathly Hallows: Part 2",
  yearOfRelease: 2011,
  duration: 130,
  actors: [
  "Ralph Fiennes",
  "Michael Gambon",
  "Alan Rickman",
  "Daniel Radcliffe"
  ],
  poster: "https://m.media-amazon.com/images/M/MV5BMjIyZGU4YzUtNDkzYi00ZDRhLTljYzctYTMxMDQ4M2E0Y2YxXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SX300.jpg",
  boxOffice: 381000185,
  rottenTomatoesScore: 96

}];



/*axios.get("http://www.omdbapi.com/?apikey=[97c9f291]&")
  .then((response)=>{
    console.log(response);
  })

  .catch((err)=>{
  	console.log(err);
  });
  */

/* GET movies listing. */
router.get('/', (req, res, next) => {
res.status(200).json({movies});


});


/* GET one movie */
router.get('/:id', (req, res) => {
	req.params.id;
  const { id } = req.params;
  // Find movie in DB
  const movie = _.find(movies, ["id", id]);
  // Return movie
  res.status(200).json({
    message: 'movie found!',
    movie 
  });
});

/* PUT new movie */
router.put('/', (req, res) => {
	if (req.body.movie === undefined){
		res.status(400).send({"error": "missing parameters"});
	}

	axios.get("http://www.omdbapi.com/", {
		params: {
			t: req.body.movie,
			apikey:api_Key,
		}

	})

	.then((rep)=> {
		if (rep.data.Response === "True"){
			const film = Informations_omdb(rep.data);
			movies.push(film);
			res.send(film);
		}
		else{
			res.status(404).send({"error1": rep.data.Error});
		}
	})

	.catch((err)=>{
		console.error(err);
        res.status(500).send({"error2": err})
	});
  });

/*router.put('/', (req, res) => {
  // Get the data from request from request
  const { movie } = req.body;
  // Create new unique id
  const id = _.uniqueId();
  // Insert it in array (normaly with connect the data with the database)
  movies.push({ movie, id });
  // Return message
  res.json({
    message: `Just added ${id}`,
    movie: { movie, id }
  });
});*/

/* UPDATE movie */
router.post('/:id', (req, res) => {
	
	
	if (req.body.movie === undefined){

		res.status(400).send({"error": "missing parameters"});
	}

	axios.get("http://www.omdbapi.com/", {

		params: {

			t: req.body.movie,
			apikey:api_Key,
		}

	})

	.then((rep)=> {
		if (rep.data.Response === "True"){

			const film = Informations_omdb(rep.data, req.params.id);
			movies[movies.indexOf(find(req.params.id))]=film;
			
			res.send(film);
		}
		else{
			
			res.status(404).send({"error1": rep.data.Error});
		}
	})

	.catch((err)=>{
		console.error(err);
        res.status(500).send({"error2": err})
	});

});
  /*// Get the :id of the movie we want to update from the params of the request
  const { id } = req.params;
  // Get the new data of the movie we want to update from the body of the request
  const { movie } = req.body;
  // Find in DB
  const movieToUpdate = _.find(movies, ["id", id]);
  // Update data with new data (js is by address)
  movieToUpdate.movie = movie;

  // Return message
  res.json({
    message: `Just updated ${id} with ${movie}`
  });*/


/* DELETE movie */
router.delete('/:id', (req, res) => {
  // Get the :id of the movie we want to delete from the params of the request
  const { id } = req.params;

  // Remove from "DB"
  _.remove(movies, ["id", id]);

  // Return message
  res.json({
    message: `Just removed ${id}`
  });
});




module.exports = router;

