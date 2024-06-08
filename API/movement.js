const express = require('express');
const router = express.Router();
const connection = require('../database');






router.post("/movement", (req, res) => {
    // TODO FIX THIS
    var player_id = req.session.playerID;
    var tile_id = req.body.tile_id;

    if (!player_id || ! tile_id)
        {
            res.send('Invalid paramaters')
            return
        }

    connection.execute('SELECT * FROM playermatch WHERE player_id = ?',
        [player_id],
        function (err, results, fields) {
            if (err) {
                console.log("couldnt get the player match", err);
            } else {
                const match_id = results[0].match_id
                console.log("player match = ", match_id);
                connection.execute('SELECT * FROM playermatch WHERE match_id = ?',
                    [match_id],
                    function (err, playerResults, fields) {
                        if (err) {
                            console.log("couldnt get the players from the match requested", err);
                        } else {
                            console.log(playerResults)
                            connection.execute('SELECT match_state_id FROM gamematch',
                                function (err, results, fields) {
                                    if (err) {
                                        console.log("couldnt get match_state_id", err);
                                    } else {
                                        
                                        console.log("Player turn ",results[0].match_state_id);
                                        console.log("Player_id that belongs to that turn =",playerResults[results[0].match_state_id - 1].player_id);
                                        if (playerResults[results[0].match_state_id - 1].player_id == player_id ) {
                                            console.log("player can play as its his turn");

                                            connection.execute('SELECT has_moved FROM playermatch WHERE player_id = ?',
                                                [player_id],
                                                function (err, results, fields) {
                                                    if (err) {
                                                        console.log("Error checking if player has moved", err);
                                                    } else {
                                                        if (results[0].has_moved) {
                                                            console.log("Player has already moved in this turn");
                                                            res.status(403).send("Player has already moved in this turn");
                                                            return;
                                                        }
                                                        
                                                        connection.execute('SELECT player_id FROM playermatch WHERE tile_id = ?',
                                                            [tile_id],
                                                            function (err, results, fields) {
                                                                if (err) {
                                                                    console.log("Error checking if the tile where the player wants to go is taken by another player", err);
                                                                } else {
                                                                    console.log(results[0])
                                                                    if (results[0] == undefined) {
                                                                        console.log("theres no player in this tile");

                                                                        connection.execute('SELECT tile_type_id FROM boardmatch WHERE tile_id = ?',
                                                                            [tile_id],
                                                                            function (err, results, fields) {
                                                                                if (err) {
                                                                                    console.log("Error checking if the tile where the player wants to go is taken by a meteor", err);
                                                                                } else {
                                                                                    console.log(results[0].tile_type_id);
                                                                                    if (results[0].tile_type_id != 2) {
                                                                                        console.log("player can move to this tile because theres no meteor");

                                                                                        if (results[0].tile_type_id == 3) {
                                                                                            connection.execute('UPDATE playermatch SET player_hazard_duration = player_hazard_duration + 1 WHERE player_id = ?',
                                                                                                [player_id],
                                                                                                function (err, results, fields) {
                                                                                                    if (err) {
                                                                                                        console.log("Error updating player_hazard_duration", err);
                                                                                                    } else {
                                                                                                        console.log("Updated player_hazard_duration in blackhole tile");
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                        }

                                                                                        connection.execute('SELECT tile_id FROM playermatch WHERE player_id = ?', [player_id], (err, playermatchResults, fields) =>{
                                                                                            if (err) {
                                                                                                console.error("Error getting tile_id", err);
                                                                                                res.status(500).send("Error getting tile_id");
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
                                                                                                        console.error("Error checking if player has moved", err);
                                                                                                        res.status(500).send("Error checking if player has moved");
                                                                                                        return;
                                                                                                    }
    
                                                                                                    if (results[0].has_moved || results[0].random_cassettes_optained || results[0].is_stoped) {
                                                                                                        console.log("Player has already moved in this turn");
                                                                                                        res.status(403).send("Player has already moved in this turn");
                                                                                                        return;
                                                                                                    }
    
                                                                                                    connection.execute('UPDATE playermatch SET tile_id = ?, has_moved = TRUE WHERE player_id = ?',
                                                                                                        [tile_id, player_id],
                                                                                                        function (err, results, fields) {
                                                                                                            if (err) {
                                                                                                                console.log("Error updating player's tile_id", err);
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
                                                                }
                                                            }
                                                        )

                                                    }
                                                }
                                            )                                            

                                        } else {
                                            console.log("its not that player turn");
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

module.exports = router;