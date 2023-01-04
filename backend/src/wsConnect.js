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
                    let [name, password] = payload
                    let replyMsg = ''

                    const player = new Player( { name: name, password: bcrypt.hashSync( password, SALT_ROUND ) } )
                    try {
                        await player.save()
                        console.log( 'Register success' )
                        replyMsg = 'register success'
                    }
                    catch ( error ) {
                        // throw new Error( 'Message DB save error' + error )
                        replyMsg = 'register failed'
                    }

                    sendData( ['rp_register', replyMsg], clientWS )
                    break
                }
                case "login": {
                    let [playerID, password] = payload
                    let player = await Player.findOne( { name: playerID } )

                    let replyMsg = ''
                    if ( bcrypt.compareSync( password, player.password ) ) {
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
                    }
                    else {
                        replyMsg = 'Failed'
                    }

                    sendData( ['rp_login', [replyMsg, playerID]], clientWS )
                    break
                }
                case "createRoom": {
                    // get info
                    // ! remove payload 
                    // let name = payload
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
                    // TODO: remove payload 
                    let [gameID, name] = payload
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
                        let bConnection = playerConnections[game.wID]
                        let wConnection = playerConnections[game.wID]
                        sendData( ['gameStarted', [game, bConnection.playerID]], wConnection.ws )
                        sendData( ['gameStarted', [game, wConnection.playerID]], bConnection.ws )
                    }
                    else {
                        // Game full
                        sendData( ['joinRoomFailed', 'Game is full'], clientWS )
                        return
                    }
                    break
                }
                case "preview": {
                    let game = connections[connectionID].game
                    let prePos = payload

                    game.preview( prePos )
                    sendData( ["do", game], clientWS )
                    break
                }
                case "move": {
                    let game = connections[connectionID].game
                    const { from, to } = payload

                    game.move( from, to )
                    boardcastDataToGame( game.gameID, ['do', game], games, playerConnections )
                    break
                }
            }
        } ) )
    }
}