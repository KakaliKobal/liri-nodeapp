var keys = require('./keys.js');

var Twitter = require('twitter');

var Spotify = require('node-spotify-api');

var request = require('request');

var fs = require('fs');

var getMyTweets = function() {
    var client = new Twitter(keys.twitterKeys);

    var params = {screen_name: 'LiriBotProject'};
    client.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error) {
            // console.log(tweets);
            var tweetOutput = [];
            for (var i = 0; i < tweets.length; i++){
                var tweeter = tweets[i].user.screen_name;
                var tweetDate = tweets[i].created_at;
                var tweetText = tweets[i].text;
                tweetOutput.push({
                tweeter: tweeter,
                tweetDate: tweetDate,
                tweetText: tweetText
                });
            }
            for(var i = 0; i < tweetOutput.length; i++){
                console.log("--------------------");
                console.log(tweetOutput[i].tweeter);
                console.log(tweetOutput[i].tweetDate);
                console.log(tweetOutput[i].tweetText); 
            };
        } else {
            console.log(error, keys);
        }
    });
}

var getNames = function(artist) {
    return artist.name;
}

function spotify(songTitle) {
   
    var spotify = new Spotify(keys.spotifyKeys);
    spotify.search({ type: 'track', query: songTitle},
    function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        var object = data.tracks.items;
        
        for (var i = 0; i < object.length; i++) {
            console.log(i);
            console.log("Artist: " + object[i].artists.map(getNames));
            console.log("Title: " + object[i].name);
            console.log("Album: " + object[i].album.name);
            console.log("Listen here: " + object[i].preview_url);
            console.log('-------------------');
        };
    });
}
var getMovie = function(movieTitle) {
    request('http://www.omdbapi.com/?t=' + movieTitle + '&y=&plot=short&apikey=trilogy&r=json', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var jsonObject = JSON.parse(body);
            console.log("Title: " + jsonObject.Title);
            console.log("Year: " + jsonObject.Year);
            console.log("Rated: " + jsonObject.Rated);
            console.log("IMDB Rating: " + jsonObject.imbdRating);
            console.log("Country: " + jsonObject.Country);
            console.log("Language: " + jsonObject.Language);
            console.log("Plot: " + jsonObject.Plot);
            console.log("Actors: " + jsonObject.Actors);
            console.log("Rotten tomatoes rating: " + jsonObject.tomatoRating);
            console.log("Rotten tomatoes URL: " + jsonObject.tomatoUrl);
        }
    });
}

var fileCommands = function() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) throw err;
        var dataArr = data.split(',');
        
        if (dataArr.length === 2) {
            command(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            command(dataArr[0]);
        }
    });
}

var command = function(caseData, functionData) {
    switch(caseData) {
        case 'my-tweets':
            getMyTweets();
            break;
        case 'spotify-this-song':
            spotify(functionData);
            break;
        case 'movie-this':
            getMovie(functionData);
            break;
        case 'do-what-it-says':
            fileCommands();
            break;
        default:
        console.log('LIRI does not know that');
    }
}

var callCommand = function(argOne, argTwo) {
    command(argOne, argTwo);
};

callCommand(process.argv[2], process.argv[3]);