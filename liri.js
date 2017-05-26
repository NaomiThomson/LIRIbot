var Twitter = require('twitter');
var { twitterKeys } = require('./keys.js');
var spotify = require('spotify');
var axios = require('axios');
var fs = require("fs");

var action = process.argv[2];

switch (action) {
  case 'my-tweets':
    showTweets();
    break
  case 'spotify-this-song':
    showMusicInfo();
    break
  case 'movie-this':
    showMovieInfo();
    break
  case 'do-what-it-says':
    randomTxt();
    break
}



// This will show your last 20 tweets and when they were created at in your terminal/bash window.
function showTweets() {
  var client = new Twitter({
    consumer_key: 'rxFnd7w2StXgfnzL2qYfUhIV1',
    consumer_secret: 'yn79ys4qNI4XZtcOYLQ8lSCf7Ohxf4tGh7Dfpkbs5I0h9aaLMV',
    access_token_key: '808478049784066050-zSBoGft3bYVfoaEJAAuNaq3mq16EDT4',
    access_token_secret: 'eU6umTNdty51x7BHLDiYVqhnEl1ui4tGvKzXgofWdfbls'
  });

  var params = { screen_name: 'ZenKitty1880' };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].text);
      }
    }
  });
}

// This will show the following information about the song in your terminal/bash window
// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from
// if no song is provided then your program will default to
// "The Sign" by Ace of Base
function showMusicInfo(txt_file_input) {

  if (txt_file_input) {
    var song_name = txt_file_input
  } else {

    if (process.argv[3] != undefined) {
      var userInput = [];

      for (var i = 3; i < process.argv.length; i++) {
        userInput.push(process.argv[i])
      }

      var song_name = userInput.join(' ');

    } else {
      var song_name = 'The Sign Ace of Base'
      console.log(song_name)
    }
  }




  spotify.search({ type: 'track', query: song_name }, function (err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }

    var artist = data.tracks.items[0].album.artists[0].name;
    var song_name = data.tracks.items[0].name;
    var preview_link = data.tracks.items[0].album.artists[0].external_urls.spotify;
    var album_name = data.tracks.items[0].album.name;

    console.log(artist);
    console.log(song_name);
    console.log(preview_link);
    console.log(album_name);

  });

}



//  * Title of the movie.
//  * Year the movie came out.
//  * IMDB Rating of the movie.
//  * Country where the movie was produced.
//  * Language of the movie.
//  * Plot of the movie.
//  * Actors in the movie.
//  * Rotten Tomatoes URL.
// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
function showMovieInfo() {


  var userInput = [];

  for (var i = 3; i < process.argv.length; i++) {
    userInput.push(process.argv[i])
  }

  var movie_title = userInput.join(' ');


  var request_url = `http://www.omdbapi.com/?i=tt3896198&t=${movie_title}&apikey=40e9cece`;

  axios({
    method: 'get',
    url: request_url,
    responseType: 'JSON'
  })
    .then(function (response) {

      var title = response.data.Title;
      var year = response.data.Year;
      var imdbRating = response.data.imdbRating;
      var country = response.data.Country;
      var language = response.data.Language;
      var plot = response.data.Plot;
      var actors = response.data.Actors;
      var website = response.data.Website;

      console.log('Title of movie: ' + title);
      console.log('Year movie came out: ' + year);
      console.log('IMDB rating of movie: ' + imdbRating);
      console.log('Country where the movie was produced: ' + country);
      console.log('Language of the movie: ' + language);
      console.log('Plot of the movie: ' + plot);
      console.log('Actors in the movie: ' + actors);
      console.log('URL: ' + website);
    });
}

// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// Feel free to change the text in that document to test out the feature for other commands.
function randomTxt() {

  fs.readFile('random.txt', 'utf8', function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");

    showMusicInfo(dataArr[1])

  });
}

