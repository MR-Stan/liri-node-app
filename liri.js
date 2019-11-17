let fs = require("fs");

require("dotenv").config();

let keys = require("./keys.js");

let Spotify = require('node-spotify-api');

let spotify = new Spotify(keys.spotify);

let axios = require("axios");

let moment = require("moment");

let action = process.argv[2];

// switch statement determines which function to run
switch (action) {
    case "concert-this":
        getConcertInfo();
        break;
    case "spotify-this-song":
        getSongInfo();
        break;
    case "movie-this":
        getMovieInfo();
        break;
    case "do-what-it-says":
        getRandomInfo();
        break;
}

// function for retrieving concert info 
function getConcertInfo() {
    // input artist name converted to string with no spaces
    let artistName = process.argv.splice(3).join().replace(/,/g, "");

    let queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

    axios.get(queryUrl).then(function (response) {
        // for each concert date / location
        for (let i = 0; i < response.data.length; i++) {
            let concertDate = moment(response.data[i].datetime).format("MM/DD/YYYY");
            let concertInfo = ["\nVenue Name: " + response.data[i].venue.city + ", " + response.data[i].venue.country + ", Concert Date: " + concertDate + "\n"].join("\n");
            console.log(concertInfo);
            // synchronously appends log.txt with concertInfo
            fs.appendFileSync("log.txt", concertInfo, function (err) {
                if (err) throw err;
            });
        }
    });
}
// NOT RETURNING RESULTS
// function for retrieving song info
function getSongInfo() {
    // input song name converted to string with no spaces
    let songName = process.argv.splice(3).join().replace(/,/g, "");
    // if no song is entered, default to The Sign by Ace of Base 
    if (songName.length === 0) {
        songName = "The sign";
    }

    spotify.search({
        type: "track",
        query: songName,
        limit: 5
    }, function (err, data) {
        if (err) {
            fs.appendFileSync("log.txt", "Error: " + err, "utf8");
            return console.log("Error: " + err);
        }

        for (let i = 0; i < data.tracks.items.length; i++) {
            songInfo = ["\nSong Title: " + data.tracks.items[i].name +
                ", Album Title: " + data.tracks.items[i].album.name +
                ", Artist(s) Name: " + data.tracks.items[i].artists[0].name +
                ", Preview URL: " + data.tracks.items[i].preview_url + '\n'].join('\n');
            console.log(songInfo);
            fs.appendFileSync("log.txt", songInfo, function (err) {
                if (err) throw err;
            });
        }
    });

}

// function for retrieving movie info
function getMovieInfo() {
    let movieName = process.argv.splice(3).join().replace(/,/g, "+");

    if (movieName.length === 0) {
        movieName = "Mr. Nobody";
    }

    let queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(function (response) {
        movieInfo = ["\nTitle: " + response.data.Title,
        "Year Released: " + response.data.Year,
        "Actors: " + response.data.Actors,
        "Plot: " + response.data.Plot,
        "Country: " + response.data.Country,
        "Language: " + response.data.Language,
        "IMDB Rating: " + response.data.Ratings[0].Value,
        "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + '\n'].join('\n');

        console.log(movieInfo);
        fs.appendFile("log.txt", movieInfo, function (err) {
            if (err) throw err;
        });
    });

}

// function to read and execute .txt file
function getRandomInfo() {

}