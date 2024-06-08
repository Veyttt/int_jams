const express = require('express');
const router = express.Router();
const connection = require('../database');



router.post('/createMatch', (request, response) => {
    var playerID = request.body.playerID;
    if (!playerID){
        response.send("playerID is not set.");
        return;
    }

    // We are inserting into the table match the match_state_id and the playerID
    connection.execute('INSERT INTO gamematch (match_name) VALUES (?)',
        [1, playerID],
        function (err, results, fields) {
            if (err){
                response.send(err);
            }else{
                // We are getting the insertId after it was inserted into the table.
                // We can use this to insert to the intermediary table player_match
                var match_id = results.insertId;

                // Insert into the intermediary table player_match the playerID and the match_id.
                // Also, this could be done in different function to avoid callback hell. 👿
                connection.execute('INSERT INTO playermatch (match_id) VALUES (?,?)',
                [playerID, match_id],
                function (err, results, fields) {
                    if (err){
                        response.send("Opsi dopsi. 💩");
                    }else{
                        // ❗ At the moment we are returning text but we could send a JSON with the playerID and match_id!!! 
                        response.send("Match created. player_id: " + playerID + " and match_id: " + match_id);
                    }
                });
            }
        });
});

// Endpoint for joining a match
router.put('/joinMatch', (request, response) =>  {
    var playerID = request.body.playerID;
    var matchID = request.body.matchID;

    // If playerID or matchID is not set, we send a message to the user
    if (!playerID || !matchID){
        response.send("Data is missing. 💩");
        return;
    }

    // We are checking if the match exists and if the player2_id is not set. Also, we are checking if the player1_id is different from the playerID since he can't join his own match.
    connection.execute('SELECT * FROM player_match WHERE pm_match_id = ? AND pm_player2_id is null AND pm_player1_id != ?',
    [matchID, playerID],
    function (err, results, fields) {
        if (err){
            response.send(err);
        }else{
            // If the results.length is 0 means that we don't have any match with the defined criteria.
            if (results.length == 0){
                response.send("No match found with id " + matchID);
            }else{
                // If we have a match, we update the player2_id with the playerID
                connection.execute('UPDATE player_match SET pm_player2_id = ?',
                [playerID],
                function (err, results, fields) {
                    if (err){
                        response.send(err);
                    }else{
                        // ❗Again, we could return a JSON with the playerID and matchID instead of text!
                        response.send("You joined match " + matchID + " 💩🦄");
                    }
                });
            }
        }
    });
});

// Endpoint for getting all matches
router.get('/matches', (request, response) => {
    connection.execute('SELECT * FROM all_matches',
    [],
    function (err, results, fields) {
        if (err)
        {
            response.send(err);
        }else{
            response.send(results);
        }
    });
});

// Endpoint for getting a specific match (:id is a parameter that we can use to get the matchID from the URL - e.g. http://localhost:3000/matches/1)
router.get('/matches/:id', (request, response) => {
    var matchID = request.params.id;
    connection.execute('SELECT * FROM all_matches WHERE match_id = ?',
    [matchID],
    function (err, results, fields) {
        if (err)
        {
            response.send(err);
        }else{
            response.send(results);
        }
    });
})

// Endpoint for getting the players of a specific match - e.g. http://localhost:3000/matches/1/player
router.get('/matches/:matchID/player', (request, response) => {
    var matchID = request.params.matchID;

    connection.execute('SELECT * FROM players_in_match WHERE match_id = ?',
    [matchID],
    function (err, results, fields) {
        if (err)
            response.send(err);
        else if (results.length == 0)
            response.send("No players found in the match."); // We are sending a message if we don't have any players in the match.
        else
            response.send(results); // We are sending the array of players.
    });
});

// Endpoint that will get the data of a specific match player (Just to showcase that we can get the data from the URL - e.g. http://localhost:3000/matches/1/player/sofia)
router.get('/matches/:matchID/player/:playerName', (request, response) => {
    var matchID = request.params.matchID;
    var playerName = request.params.playerName;

    connection.execute('SELECT player_username, player_level FROM players_in_match WHERE match_id = ? AND player_username = ?',
    [matchID, playerName],
    function (err, results, fields) {
        if (err)
            response.send(err);
        else if (results.length == 0)
            response.send("No player found with that name in the match."); // We are sending a message if we don't have any player with that name in the match.
        else
            response.send(results[0]); // We are sending the first element of the array since we are only expecting one player.
    });   
});

module.exports = router;