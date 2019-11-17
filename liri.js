let fs = require("fs");

require("dotenv").config();

let keys = require("./keys.js");

let spotify = new Spotify(keys.spotify);

let axios = require("axios");

let moment = require("moment");

let action = process.argv[2];

// switch statement determines which function to run
switch (action) {
    case "concert-this":
        concertInfo();
        break;
    case "spotify-this-song":
        songInfo();
        break;
    case "movie-this":
        movieInfo();
        break;
    case "do-what-it-says":
        randomInfo();
        break;
}

// function for retrieving concert info using band name
function concertInfo() {
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

// function for song info

// function for movie info

// function to read and execute .txt file

concertInfo();