const express = require('express');
const router = express.Router();
const connection = require('../database');

router.post("/UseHazardCassette", (req, res) => {
    console.log("Asking /UseHazardCassete");

    var player_id = req.session.playerID;
    if (!player_id) {
        res.status(403).send("You are not logged in");
        return;
    }

    var player_cassette_id = req.body.player_cassette_id;
    if (!player_cassette_id) {
        res.status(400).send("Missing required variables");
        return;
    }

    var tile_id = req.body.tile_id;
    if (!tile_id) {
        res.status(400).send("Missing required variables");
        return;
    }

    var playertarget_id
    //  = req.body.playertarget_id;
    // if (!playertarget_id){
    //     res.status(400).send("Missing target player");
    //     return;
    // }

    console.log("Play the cassette with id " + player_cassette_id + " on tile " + tile_id);

    connection.execute('SELECT * FROM playermatch WHERE player_id = ?',
        [player_id],
        function (err, results, fields) {
            if (err) {
                res.status(500).send(err);
                return;
            } else {
                const match_id = results[0].playermatch_match_id
                connection.execute('SELECT * FROM playermatch WHERE playermatch_match_id = ?',
                    [match_id],
                    function (err, playerResults, fields) {
                        if (err) {
                            res.status(500).send(err);
                            return;
                        } else {
                            connection.execute('SELECT match_state_id FROM gamematch',
                            function (err, results, fields) {
                                if (err) {
                                    res.status(500).send(err);
                                    return;
                                } else {
                                    if (playerResults[results[0].match_state_id - 1].player_id == player_id ) {

                                        connection.execute('SELECT * FROM playermatchcassette WHERE player_id = ? AND player_cassette_id = ?',
                                            [player_id, player_cassette_id],
                                            function (err, cassetteResults, fields) {
                                                if (err) {
                                                    res.status(500).send(err);
                                                    return;
                                                } else {
                                                    if (cassetteResults.length == 0) {
                                                        res.status(400).send("Player does not have that cassette");
                                                        return;
                                                    }

                                                    connection.execute('SELECT * FROM boardmatch WHERE tile_id = ?',
                                                        [tile_id],
                                                        function (err, results, fields) {
                                                            if (err) {
                                                                res.status(500).send(err);
                                                                return;
                                                            } else {

                                                                if (results.length == 0) {
                                                                    res.status(400).send("Tile does not exist");
                                                                    return;
                                                                }

                                                                if (results[0].tile_type_id == 1) {

                                                                    connection.execute('SELECT * FROM playermatch WHERE playermatch_match_id = ?',
                                                                        [match_id],
                                                                        function (err, results, fields) {
                                                                            if (err) {
                                                                                res.status(500).send(err);
                                                                                return;
                                                                            } else {

                                                                                if (results.length < 1) {
                                                                                    res.status(400).send("Can't get both players from the query.");
                                                                                    return;
                                                                                }

                                                                                if (results[0].tile_id == tile_id || results[1].tile_id == tile_id || cassetteResults[0].cassette_id > 3) {

                                                                                    res.status(400).send("theres a player here you cant put the hazard here");
                                                                                    return;

                                                                                } else {

                                                                                    connection.execute("SELECT * FROM playermatch WHERE player_id = ?", [player_id], (err, results) => {
                                                                                        if (err) {
                                                                                            res.status(500).send(err);
                                                                                            return;
                                                                                        }

                                                                                        if (results[0].cassettes_broken || results[0].random_cassettes_optained) {
                                                                                            res.status(403).send("Player cant play a cassette right now");
                                                                                            return;
                                                                                        }

                                                                                        const cassette = cassetteResults[0].cassette_id;
                                                                                        const cassette_hazard_duration = 3

                                                                                        if (cassette == 3){
                                                                                            connection.execute('UPDATE boardmatch SET tile_type_id = ?, hazard_duration = ? WHERE tile_id = ? OR tile_id = ?',
                                                                                                [cassette + 1, cassette_hazard_duration + 3, tile_id],
                                                                                                function(err, results, fields) {
                                                                                                    if (err){
                                                                                                        res.status(500).send(err);
                                                                                                        return;
                                                                                                    } else {
                                                                                                        res.status(200).send("player played cassette number:" + cassette);
                                                                                                        return;
                                                                                                    }
                                                                                                    
                                                                                                }

                                                                                            );

                                                                                        } else if (cassette < 3) {
                                    
                                                                                            connection.execute('UPDATE boardmatch SET tile_type_id = ?, hazard_duration = ? WHERE tile_id = ?',
                                                                                                [cassette + 1, cassette_hazard_duration, tile_id],
                                                                                                function(err, results, fields) {
                                                                                                    if (err){
                                                                                                        res.status(500).send(err);
                                                                                                        return;
                                                                                                    } else {
                                                                                                        res.status(200).send("player played cassette number:" + cassette);
                                                                                                        return;
                                                                                                    }

                                                                                                }

                                                                                            );
                                    
                                                                                        }

                                                                                        connection.execute('UPDATE playermatch SET has_used_a_cassette = TRUE WHERE player_id = ?',
                                                                                            [player_id],
                                                                                            function(err, results, fields) {
                                                                                                if (err){
                                                                                                    res.status(500).send(err);
                                                                                                    return;
                                                                                                } else {
                                                                                                    res.status(200).send("player played cassette number:" + cassette);
                                                                                                    return;
                                                                                                }

                                                                                            }

                                                                                        );

                                                                                        connection.execute('UPDATE playermatchcassette SET cassette_id = 0 WHERE player_id = ? AND player_cassette_id = ?',
                                                                                            [player_id, player_cassette_id],
                                                                                            function(err, results, fields) {
                                                                                                if (err){
                                                                                                    res.status(500).send(err);
                                                                                                    return;
                                                                                                } else {
                                                                                                    console.log("the cassette the player used got deleted");
                                                                                                };

                                                                                            }

                                                                                        );

                                                                                    });

                                                                                }

                                                                                if (playertarget_id == playerResults[0].player_id || playertarget_id == playerResults[1].player_id) {

                                                                                    connection.execute("SELECT * FROM playermatch WHERE player_id = ?", [player_id], (err, results) => {
                                                                                        if (err) {
                                                                                            res.status(500).send(err);
                                                                                            return;
                                                                                        }

                                                                                        if (results[0].cassettes_broken || results[0].random_cassettes_optained) {
                                                                                            res.status(403).send("Player cant play a cassette right now");
                                                                                            return;
                                                                                        }

                                                                                        const cassette = cassetteResults[0].cassette_id;

                                                                                        if (cassette == 4) {

                                                                                            connection.execute('UPDATE playermatch SET is_stoped = TRUE WHERE player_id = ?',
                                                                                                [playertarget_id],
                                                                                                function(err, results, fields) {
                                                                                                    if (err){
                                                                                                        res.status(500).send(err);
                                                                                                        return;
                                                                                                    } else {
                                                                                                        console.log("player played cassette number:", cassette);
                                                                                                    }
    
                                                                                                }
    
                                                                                            );
    
                                                                                        } else if (cassette == 5) {
    
                                                                                            connection.execute('UPDATE playermatch SET cassettes_broken = TRUE WHERE player_id = ?',
                                                                                                [playertarget_id],
                                                                                                function(err, results, fields) {
                                                                                                    if (err){
                                                                                                        res.status(500).send(err);
                                                                                                        return;
                                                                                                    } else {

                                                                                                        console.log("player played cassette number:", cassette);
                                                                                                    }
    
                                                                                                }
    
                                                                                            );
    
                                                                                        } else if (cassette == 6) {

                                                                                            connection.execute('SELECT tile_type_id FROM boardmatch WHERE tile_id = ?',
                                                                                                [tile_id],
                                                                                                function (err, results, fields) {
                                                                                                    if (err) {
                                                                                                        res.status(500).send(err);
                                                                                                        return;
                                                                                                    } else {
                                                                                                        console.log(results[0].tile_type_id);
                                                                                                        if (results[0].tile_type_id != 2) {
                                                                                                            console.log("player can move to this tile because theres no meteor");

                                                                                                            if (results[0].tile_type_id == 3) {
                                                                                                                connection.execute('UPDATE playermatch SET player_hazard_duration = player_hazard_duration + 1 WHERE player_id = ?',
                                                                                                                    [player_id],
                                                                                                                    function (err, results, fields) {
                                                                                                                        if (err) {
                                                                                                                            res.status(500).send(err);
                                                                                                                            return;
                                                                                                                        } else {
                                                                                                                            console.log("Updated player_hazard_duration in blackhole tile");
                                                                                                                        }
                                                                                                                    }
                                                                                                                )
                                                                                                            }

                                                                                                            connection.execute('SELECT tile_id FROM playermatch WHERE player_id = ?', [player_id], (err, playermatchResults, fields) =>{
                                                                                                                if (err) {
                                                                                                                    res.status(500).send(err);
                                                                                                                    return;
                                                                                                                }
                                                                                                        
                                                                                                                const player_tile_id = playermatchResults[0].tile_id;

                                                                                                                if (
                                                                                                                    player_tile_id + 1 == tile_id && player_tile_id !== 5 && player_tile_id !== 10 && player_tile_id !== 15 && player_tile_id !== 20 && player_tile_id !== 25 ||
                                                                                                                    player_tile_id - 1 == tile_id && player_tile_id !== 1 && player_tile_id !== 6 && player_tile_id !== 11 && player_tile_id !== 16 && player_tile_id !== 21 ||
                                                                                                                    player_tile_id + 5 == tile_id && player_tile_id !== 21 && player_tile_id !== 22 && player_tile_id !== 23 && player_tile_id !== 24 && player_tile_id !== 25 ||
                                                                                                                    player_tile_id - 5 == tile_id && player_tile_id !== 1 && player_tile_id !== 2 && player_tile_id !== 3 && player_tile_id !== 4 && player_tile_id !== 5
                                                                                                                ) {
                                                                                                                    connection.execute("SELECT * FROM playermatch WHERE player_id = ?", [player_id], (err, results) => {
                                                                                                                        if (err) {
                                                                                                                            res.status(500).send(err);
                                                                                                                            return;
                                                                                                                        }
                        
                                                                                                                        if (results[0].is_stoped) {
                                                                                                                            console.log("Player has already moved in this turn");
                                                                                                                            res.status(403).send("Player has already moved in this turn");
                                                                                                                            return;
                                                                                                                        }
                        
                                                                                                                        connection.execute('UPDATE playermatch SET tile_id = ? WHERE player_id = ?',
                                                                                                                            [tile_id, playertarget_id],
                                                                                                                            function (err, results, fields) {
                                                                                                                                if (err) {
                                                                                                                                    res.status(500).send(err);
                                                                                                                                    return;
                                                                                                                                } else {
                                                                                                                                    console.log("Player moved to", tile_id);
                                                                                                                                };
                                                                                                                            }
                                                                                                                        );  
                        
                                                                                                                    });
                        
                                                                                                                }

                                                                                                            })

                                                                                                        } else {
                                                                                                            console.log("player cant move to this tile because theres a meteor");
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                        }
    
                                                                                        connection.execute('UPDATE playermatch SET has_used_a_cassette = TRUE WHERE player_id = ?',
                                                                                            [player_id],
                                                                                            function(err, results, fields) {
                                                                                                if (err){
                                                                                                    res.status(500).send(err);
                                                                                                    return;
                                                                                                } else {
                                                                                                    console.log("player played a cassette");
                                                                                                }
    
                                                                                            }
    
                                                                                        );
    
                                                                                        connection.execute('UPDATE playermatchcassette SET cassette_id = 0 WHERE player_id = ? AND player_cassette_id = ?',
                                                                                            [player_id, player_cassette_id],
                                                                                            function(err, results, fields) {
                                                                                                if (err){
                                                                                                    res.status(500).send(err);
                                                                                                    return;
                                                                                                } else {
                                                                                                    console.log("the cassette the player used got deleted");
                                                                                                };
    
                                                                                            }
    
                                                                                        );

                                                                                    });

                                                                                } else {

                                                                                    res.status(400).send("player selected is not correct");
                                                                                    return;
                                                                                    
                                                                                }

                                                                            }
                                                                        }
                                                                    )

                                                                } else {

                                                                    res.status(400).send("this tile already has a hazard choose another tile");
                                                                    return;

                                                                }

                                                            }
                                                        }
                                                    )

                                                };

                                            }
                                        );

                                    } else {
                                        res.status(403).send("its not that player turn");
                                        return;
                                    }
                                } 
                            }
                            
                            )
                        }
                    }
                )
            }
        }
    )
});


router.post("/UseMeteorCassette", (req, res) => {
    console.log("Asking /UseMeteorCassette");

    var player_id = req.session.playerID;
    if (!player_id) {
        res.status(403).send("You are not logged in");
        return;
    }

    var player_cassette_id = req.body.player_cassette_id;
    if (!player_cassette_id) {
        res.status(400).send("Missing required variables");
        return;
    }

    var tile_id = req.body.tile_id;
    if (!tile_id) {
        res.status(400).send("Missing required variables");
        return;
    }

    function ChangeTileID(){
        var query = "INSERT INTO boardmatch (match_id, tile_id, tile_type_id, hazard_duration) VALUES (" + req.session.matchID + ", " + tile_id + ", 2, 3)";
        connection.execute('INSERT INTO boardmatch (match_id, tile_id, tile_type_id, hazard_duration) VALUES (?,?,?,?)',
            [req.session.matchID, tile_id, 2, 3],
            function(err, results, fields) {
                if (err){
                    res.status(500).send(err);
                    return;
                } else {
                    res.status(200).send({
                        query: query,
                        message: "Meteor cassette used"
                    });
                    return;
                }
            }
        );
    }

    ChangeTileID();
});

router.get('/getTiles', (req, res) => {
    var playerID = req.session.playerID;

    if (!playerID) {
        res.status(403).send("You are not logged in");
        return;
    }

    var matchID = req.session.matchID;

    function getMatchIDFirst(){
        connection.execute('SELECT * from playermatch where player_id = ?',
            [playerID],
            function(err, results, fields) {
                if (err){
                    res.status(500).send(err);
                    return;
                }   

                req.session.matchID = results[0].playermatch_match_id;
                matchID = results[0].playermatch_match_id;
                getHazards();
            }
        );
    }

    function getHazards(){
        var query = 'SELECT * from boardmatch where tile_type_id > 1 and match_id = ' + matchID;
        connection.execute('SELECT * from boardmatch where tile_type_id > 1 and match_id = ?',
            [matchID],
            function(err, results, fields) {
                if (err)
                    res.status(500).send(err);
                else
                    res.send({
                        query: query,
                        tiles: results});
            }
        );
    }

    if (matchID)
        getHazards();
    else
        getMatchIDFirst();
});

router.get("/playerTurn", (req, res) => {
    var playerID = req.session.playerID;
    var matchID = req.session.matchID;

    if (!matchID || !playerID) {
        res.send({});
        return;
    }

    var player1ID 

    function getPlayer1ID(){
        connection.execute('SELECT * FROM playermatch WHERE playermatch_match_id = ?',
            [matchID],
            function(err, results, fields) {
                if (err)
                    res.status(500).send(err);
                else{
                    player1ID = results[0].player_id;
                    getPlayerTurn();
                }
            }
        );
    }

    function getPlayerTurn(){
        connection.execute('SELECT * FROM gamematch WHERE match_id = ?',
            [matchID],
            function(err, results, fields) {
                if (err)
                    res.status(500).send(err);
                else{
                    if (results[0].match_state_id == 1){
                        if (playerID == player1ID)
                            res.send({turn: true});
                        else
                            res.send({turn: false});
                    }
                    else {
                        if (playerID == player1ID)
                            res.send({turn: false});
                        else
                            res.send({turn: true});
                    }
                }
            }
        );
    }

    getPlayer1ID();
})


// Cesar testing stuff hehehehe :)
// connection.execute('select * from boardmatch',
//     [],
//     function(err, results, fields) {
//         if (err)
//             console.log(err);
//         else
//             console.log(results);
//     }
// );

module.exports = router;