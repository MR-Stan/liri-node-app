require("dotenv").config();

let keys = require("./keys.js");

let spotify = new Spotify(keys.spotify);
