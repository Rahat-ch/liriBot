require("dotenv").config();
//above and below required for using spotify api and hiding keys
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require('moment');
moment().format();


//setting user inputs into a variable
var command = process.argv[2];
var value = process.argv.slice(3).join(" ");

//switch statement for each liri input
switch (command) {
case "concert-this":
  concert();
  break;

case "spotify-this-song":
  song();
  break;

case "movie-this":
  movie();
  break;

case "do-what-it-says":
  whatItSays();
  break;
}

//functions for each liri input

//concert function with bandsintown API
function concert (){
  axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp").then(
    function(response){
      console.log("Here are " + value + "'s upcoming concerts: \n");
      for (var i = 0; i < response.data.length; i++) {
        console.log("Venue Name: " + response.data[i].venue.name);
        console.log("Location: " + response.data[i].venue.city + "," + response.data[i].venue.country);
        var date = moment(response.data[i].datetime);
        var dateConvert = date.utc().format("MM-DD-YYYY");
        console.log("Date of the event: " + dateConvert + "\n" );

      }
    }
  )
};

//spotify function
function song (){
  if(value === ""){
		value = "The Sign";
    console.log("You didn't enter a value so I decided to search Spotify for The Sign");
	}
  spotify.search({ type: 'track', query: value }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
  console.log("Here are the results I found on Spotify for " + value +"\n");
  for (var i = 0; i < data.tracks.items.length; i++) {
    console.log("Artist: " + data.tracks.items[i].artists[0].name);
    console.log("Song: " + data.tracks.items[i].name);
    console.log("Open on Spotify: " + data.tracks.items[i].external_urls.spotify);
    console.log("Album: " + data.tracks.items[i].album.name + "\n");
  }
})
};
