require("dotenv").config();

let fs = require("fs");

let keys = require("./keys.js");

let Spotify = require('node-spotify-api');

let spotify = new Spotify(keys.spotify);

let axios = require("axios");

let moment = require("moment");

let action = process.argv[2];

let name = process.argv.splice(3).join();

// determine which function to run
if (action === "concert-this") {
    getConcertInfo();
}
else if (action === "spotify-this-song") {
    getSongInfo();
}
else if (action === "movie-this") {
    getMovieInfo();
}
else if (action === "do-what-it-says") {
    getRandomInfo();
}
else {
    console.log("Error: Invalid Entry")
}

// function for retrieving concert info 
function getConcertInfo() {
    // input artist name converted to string with no spaces
    let artistName = name.replace(/,/g, "");

    let queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

    axios.get(queryUrl).then(function (response) {
        // for each concert date / location
        for (let i = 0; i < response.data.length; i++) {
            let concertDate = moment(response.data[i].datetime).format("MM/DD/YYYY");
            let concertInfo = ["\nVenue Name: " + response.data[i].venue.name,
            "Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country,
            "Concert Date: " + concertDate + "\n"].join("\n");
            console.log(concertInfo);
            // synchronously appends log.txt with concertInfo
            fs.appendFileSync("log.txt", concertInfo, function (error) {
                if (error) throw error;
            });
        }
    });
}

// function for retrieving song info
function getSongInfo() {
    let songName = "";
    // if no song is entered, default to The Sign by Ace of Base 
    if (!name) {
        songName = "the sign";
    }
    else {
        songName = name;
    }

    spotify.search({
        type: "track",
        query: songName,
        limit: 5 // number of results
    }, function (error, data) {
        if (error) {
            fs.appendFileSync("log.txt", "Error: " + error, "utf8");
            return console.log("Error: " + error);
        }

        for (let i = 0; i < data.tracks.items.length; i++) {
            songInfo = ["\nSong Title: " + data.tracks.items[i].name,
            "Album Title: " + data.tracks.items[i].album.name,
            "Artist(s) Name: " + data.tracks.items[i].artists[0].name,
            "Preview URL: " + data.tracks.items[i].preview_url + '\n'].join('\n');
            console.log(songInfo);
            fs.appendFileSync("log.txt", songInfo, function (error) {
                if (error) throw error;
            });
        }
    });
}

// function for retrieving movie info
function getMovieInfo() {
    let movieName = name.replace(/,/g, "+");
    // if no movie name entered, default to Mr. Nobody
    if (!movieName) {
        movieName = "Mr. Nobody";
    }

    let queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(function (response) {
        movieInfo = ["\nTitle: " + response.data.Title,
        "Year Released: " + response.data.Year,
        "IMDB Rating: " + response.data.Ratings[0].Value,
        "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value,
        "Country: " + response.data.Country,
        "Language: " + response.data.Language,
        "Plot: " + response.data.Plot,
        "Actors: " + response.data.Actors + '\n'].join('\n');
        console.log(movieInfo);
        fs.appendFile("log.txt", movieInfo, function (error) {
            if (error) throw error;
        });
    });

}

// function to read and execute random.txt
function getRandomInfo() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) throw error;
        else if (data.includes("concert-this")) {
            let str = data.split(",").pop().replace(/"/g, "");
            name = str;
            getConcertInfo();
        }
        else if (data.includes("spotify-this-song")) {
            let str = data.split(",").pop().replace(/"/g, "");
            name = str;
            getSongInfo();
        }
        else if (data.includes("movie-this")) {
            let str = data.split(",").pop().replace(/"/g, "").replace(/ /g, "+");
            name = str;
            getMovieInfo();
        }
        else {
            console.log("Error 1337");
        }
    });
}

