// import 
import bcrypt from 'bcryptjs'

import { Game } from "./Game.js"
import { Player } from '../models/Player.js'

// functions 
const sendData = ( data, clientWS ) => {
    clientWS.send( JSON.stringify( data ) )
}

const boardcastDataToGame = ( gameID, data, games, playerConnections ) => {
    // boardcast to all players in game 
    let game = games[gameID]
    let wWS = playerConnections[game.wID].ws
    let bWS = playerConnections[game.bID].ws

    sendData( data, wWS )
    sendData( data, bWS )
}

// constant 
const SALT_ROUND = 10

export default {
    onMessage: ( clientWS, connectionID, games, connections, playerConnections ) => {
        return ( ( async ( byteString ) => {
            const { data } = byteString
            const [task, payload] = JSON.parse( data )

            switch ( task ) {
                case "register": {
                    let [playerID, password] = payload

                    const player = new Player( { name: playerID, password: bcrypt.hashSync( password, SALT_ROUND ) } )

                    try {
                        // register
                        await player.save()
                        sendData( ['rp_register', 'Success'], clientWS )
                        console.log( `Register success: ${playerID}` )
                    }
                    catch ( error ) {
                        sendData( ['rp_register', `Failed: Player ID is used`], clientWS )
                        console.log( `Register failed: repeated player ID` )
                        break
                    }
                    break
                }

                case "login": {
                    // Get information 
                    let [playerID, password] = payload
                    let player = await Player.findOne( { name: playerID } )

                    // Login failed: haven't registered 
                    if ( !player ) {
                        sendData( ['rp_login', ['Failed: Player haven\'t registered.', playerID]], clientWS )
                        console.log( `Login failed: ${playerID} haven\'t registered` )
                        break
                    }

                    // Login failed: incorred password 
                    if ( bcrypt.compareSync( password, player.password ) == false ) {
                        sendData( ['rp_login', ['Failed: Incorrect password.', playerID]], clientWS )
                        console.log( `Login failed: Incorrect password` )
                        break
                    }

                    // Login success 

                    // Already log in
                    if ( playerConnections[playerID] ) {
                        connections[playerConnections[playerID].connectionID].playerID = ''
                        let pastWS = playerConnections[playerID].ws
                        playerConnections[playerID].ws = clientWS

                        if ( playerConnections[playerID].gameID ) {
                            // is playing a game 
                            let gameID = playerConnections[playerID].gameID
                            let game = games[gameID]
                            let opName = ( game.wID == playerID ? game.wID : game.bID )
                            let clr = ( game.wID == playerID ? 'w' : 'b' )
                            sendData( ['sudden_game', [game, opName, gameID, clr]], clientWS )
                        }

                        sendData( ['Logged in from other place'], pastWS )
                    }

                    // set connections 
                    connections[connectionID] = {
                        playerID: playerID
                    }

                    // store connection info 
                    playerConnections[playerID] = {
                        ws: clientWS,
                        gameID: '',
                        connectionID: connectionID
                    }

                    sendData( ['rp_login', ['Success', playerID]], clientWS )
                    console.log( 'Login success' )

                    break
                }

                case "createRoom": {
                    // get info
                    let playerID = connections[connectionID].playerID

                    // create game 
                    let newGame = new Game()
                    newGame.player_join( playerID )

                    // store game 
                    games[newGame.gameID] = newGame

                    // store name 
                    playerConnections[playerID].gameID = newGame.gameID

                    // send message 
                    // payload: [game, color, gameID]
                    sendData( ['createRoomSuccess', [newGame, 'w', newGame.gameID]], clientWS )

                    console.log( `Create new game by ${playerID}` )
                    break
                }
                case "joinRoom": {
                    // get info
                    let gameID = payload
                    let playerID = connections[connectionID].playerID

                    // Game not exist 
                    if ( games[gameID] == undefined ) {
                        sendData( ['joinRoomFailed', 'Game doesn\'t exist'], clientWS )
                        console.log( 'Join failed: the game doesn\'t exist' )
                        return
                    }

                    let game = games[gameID]
                    if ( game.player_join( playerID ) ) {
                        // join game
                        playerConnections[playerID].gameID = game.gameID

                        // payload: [game, color, gameID]
                        sendData( ['joinRoomSuccess', [game, 'b', gameID]], clientWS )
                        console.log( 'Join success' )

                        // send start msg to both players 
                        // payload: [game, opponentName ]

                        let wWS = playerConnections[game.wID].ws
                        let bWS = playerConnections[game.bID].ws

                        sendData( ['gameStarted', [game, game.bID]], wWS )
                        sendData( ['gameStarted', [game, game.wID]], bWS )
                        console.log( 'Game started' )
                    }
                    else {
                        // Game full
                        sendData( ['joinRoomFailed', 'Game is full'], clientWS )
                        console.log( 'Join failed: the game is full' )
                        return
                    }
                    break
                }
                case "preview": {
                    let playerID = connections[connectionID].playerID
                    let gameID = playerConnections[playerID].gameID
                    let game = games[gameID]
                    let prePos = payload


                    game.preview( prePos )
                    sendData( ["do", game], clientWS )
                    console.log( 'Preview' )
                    break
                }
                case "move": {
                    let playerID = connections[connectionID].playerID
                    let gameID = playerConnections[playerID].gameID
                    let game = games[gameID]
                    const { from, to } = payload

                    game.move( from, to )
                    boardcastDataToGame( game.gameID, ['do', game], games, playerConnections )
                    console.log( 'Moved' )
                    break
                }
            }
        } ) )
    }
}