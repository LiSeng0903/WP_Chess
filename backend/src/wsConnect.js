// import 
import { Game } from "./Game.js"
import { Player } from '../models/Player.js'
import bcrypt from 'bcryptjs'

// functions 
const sendData = ( data, clientWS ) => {
    clientWS.send( JSON.stringify( data ) )
}

const boardcastDataToGame = ( gameID, data, games, connections ) => {
    // boardcast to all players in game 
    let game = games[gameID]
    let wWS = connections[game.wID].ws
    let bWS = connections[game.bID].ws

    sendData( data, wWS )
    sendData( data, bWS )
}

// constant 
const SALT_ROUND = 10

export default {
    onMessage: ( clientWS, connectionID, games, connections ) => {
        return ( ( async ( byteString ) => {
            const { data } = byteString
            const [task, payload] = JSON.parse( data )

            switch ( task ) {
                case "register": {
                    let [name, password] = payload
                    let replyMsg = ''

                    const player = new Player( { name: name, password: bcrypt.hashSync( password, 10 ) } )
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
                    let [name, password] = payload
                    let player = await Player.findOne( { name: name } )

                    let replyMsg = ''
                    if ( bcrypt.compareSync( password, player.password ) ) {
                        replyMsg = 'Success'
                    }
                    else {
                        replyMsg = 'Failed'
                    }

                    sendData( ['rp_login', [replyMsg, name]], clientWS )
                    break
                }
                case "createRoom": {
                    // get info
                    let name = payload

                    // create game 
                    let newGame = new Game()
                    newGame.player_join( connectionID )

                    // store game 
                    games[newGame.gameID] = newGame

                    // store name 
                    connections[connectionID].name = name
                    connections[connectionID].game = newGame

                    // send message 
                    sendData( ['createRoomSuccess', [newGame, 'w', newGame.gameID]], clientWS )
                    break
                }
                case "joinRoom": {
                    // get info
                    let [gameID, name] = payload

                    // Game not exist 
                    if ( games[gameID] == undefined ) {
                        sendData( ['joinRoomFailed', 'Game doesn\'t exist'], clientWS )
                        return
                    }

                    let game = games[gameID]
                    if ( game.player_join( connectionID ) ) {
                        // join game 
                        connections[connectionID].game = game
                        connections[connectionID].name = name

                        sendData( ['joinRoomSuccess', [game, 'b', gameID]], clientWS )

                        // sendDate( [msg, [game, opponentName ]] )
                        // send start msg to both players 
                        let bConnection = connections[game.bID]
                        let wConnection = connections[game.wID]
                        sendData( ['gameStarted', [game, bConnection.name]], wConnection.ws )
                        sendData( ['gameStarted', [game, wConnection.name]], bConnection.ws )
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
                    boardcastDataToGame( game.gameID, ['do', game], games, connections )
                    break
                }
            }
        } ) )
    }
}