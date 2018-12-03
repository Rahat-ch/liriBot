require("dotenv").config();
//above and below required for using spotify api and hiding keys
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require('moment');
var fs = require('fs');
moment().format();


//setting user inputs into a variable
var command = process.argv[2];


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
function concert() {
  //moved this into function becuase this needs to be slightly different based on the api used
  var value = process.argv.slice(3).join(" ");
  axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp").then(
    function(response) {
      console.log("Here are " + value + "'s upcoming concerts: \n");
      for (var i = 0; i < response.data.length; i++) {
        console.log("Venue Name: " + response.data[i].venue.name +'\n' + "Location: " + response.data[i].venue.city + "," + response.data[i].venue.country);

        //using moment to convert date to mm-dd-yyyy format
        var date = moment(response.data[i].datetime);
        var dateConvert = date.utc().format("MM-DD-YYYY");
        console.log("Date of the event: " + dateConvert + "\n");

      }
    }
  )
};

//spotify function
function song() {
  //moved this into function becuase this needs to be slightly different based on the api used
  var value = process.argv.slice(3).join(" ");
  if (value === "") {
    value = "The Sign";
    console.log("You didn't enter a value so I decided to search Spotify for The Sign");
  }
  spotify.search({
    type: 'track',
    query: value
  }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log("Here are the results I found on Spotify for " + value + "\n");

    for (var i = 0; i < data.tracks.items.length; i++) {
      console.log("Artist: " + data.tracks.items[i].artists[0].name);
      console.log("Song: " + data.tracks.items[i].name);
      console.log("Open on Spotify: " + data.tracks.items[i].external_urls.spotify);
      console.log("Album: " + data.tracks.items[i].album.name + "\n");
    }
  })
};

//ombd function
function movie() {

  //this is just so it looks nice when lirir says she found her results
  var liriValue = process.argv.slice(3).join(" ");

  //omdb needs a + for titles with multiple words
  var value = "";
  for (var i = 3; i < process.argv.length; i++) {

    if (i > 3 && i < process.argv.length) {
      value = value + "+" + process.argv[i];
    } else {
      value += process.argv[i];

    }
  }
  var queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=912f4aec";

  axios.get(queryUrl).then(
    function(response) {
      console.log("Here are the results I found for " + liriValue + "\n");
      console.log("Title: " + response.data.Title);
      console.log("Released: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      console.log("Rotton Tomatos Rating: " + response.data.Ratings[1].Value);
      console.log("Produced in: " + response.data.Country);
      console.log("Language: " + response.data.Language + "\n");
      console.log("Plot: " + response.data.Plot + "\n");
      console.log("Actors: " + response.data.Actors);

    }
  );


};

//do what it says function

function whatItSays(){
  //liri will check whatever is written in random.txt
  fs.readFile("random.txt", "utf8", function(error, data) {
  if (error) {
    return console.log(error);
  }

  console.log("I was told to " + data);
  //data will be put into array for easy acces
  var dataArr = data.split(",");

  //value argument will be set to second value in array and switch statement will run again with first value in array
  process.argv[3] = dataArr[1];
  switch (dataArr[0]) {
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


});


};
