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

// function for retrieving concert info using band name
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
// function for song info
function getSongInfo() {
    // input song name converted to string with no spaces
    let songName = process.argv.splice(3).join().replace(/,/g, "");

    if (songName.length === 0) {
        console.log("fail")
    }
    else {
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
}

// function for movie info
function getMovieInfo() {

}

// function to read and execute .txt file
function getRandomInfo() {

}