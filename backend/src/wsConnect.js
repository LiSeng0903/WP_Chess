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
                        await player.save()
                        sendData( ['rp_register', 'Success'], clientWS )
                        console.log( `Register success: ${playerID}` )
                    }
                    catch ( error ) {
                        // throw new Error( 'Message DB save error' + error )
                        sendData( ['rp_register', `Failed: Player ID is used`], clientWS )
                        console.log( `Register failed` )
                        break
                    }
                    break
                }

                case "login": {
                    // Get information 
                    let [playerID, password] = payload
                    let player = await Player.findOne( { name: playerID } )
                    if ( !player ) {
                        sendData( ['rp_login', ['Failed: Player haven\'t registered.', playerID]], clientWS )
                        break
                    }

                    let replyMsg = ''
                    if ( bcrypt.compareSync( password, player.password ) == false ) {
                        sendData( ['rp_login', ['Failed: Wrong password.', playerID]], clientWS )
                        break
                    }
                    replyMsg = 'Success'

                    // set connections 
                    connections[connectionID] = {
                        playerID: playerID
                    }

                    // store connection info 
                    playerConnections[playerID] = {
                        ws: clientWS,
                        gameID: ''
                    }

                    sendData( ['rp_login', ['Success', playerID]], clientWS )



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
                    break
                }
                case "joinRoom": {
                    // get info
                    let gameID = payload
                    let playerID = connections[connectionID].playerID

                    // Game not exist 
                    if ( games[gameID] == undefined ) {
                        sendData( ['joinRoomFailed', 'Game doesn\'t exist'], clientWS )
                        return
                    }

                    let game = games[gameID]
                    if ( game.player_join( playerID ) ) {
                        // join game
                        playerConnections[playerID].gameID = game.gameID

                        // payload: [game, color, gameID]
                        sendData( ['joinRoomSuccess', [game, 'b', gameID]], clientWS )

                        // send start msg to both players 
                        // payload: [game, opponentName ]

                        let wWS = playerConnections[game.wID].ws
                        let bWS = playerConnections[game.bID].ws

                        sendData( ['gameStarted', [game, game.bID]], wWS )
                        sendData( ['gameStarted', [game, game.wID]], bWS )
                    }
                    else {
                        // Game full
                        sendData( ['joinRoomFailed', 'Game is full'], clientWS )
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
                    break
                }
                case "move": {
                    let playerID = connections[connectionID].playerID
                    let gameID = playerConnections[playerID].gameID
                    let game = games[gameID]
                    const { from, to } = payload

                    game.move( from, to )
                    boardcastDataToGame( game.gameID, ['do', game], games, playerConnections )
                    break
                }
            }
        } ) )
    }
}