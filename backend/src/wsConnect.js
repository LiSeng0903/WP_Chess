// import 
import { Game } from "./Game.js"

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

export default {
    onMessage: ( clientWS, connectionID, games, connections ) => {
        return ( ( async ( byteString ) => {
            const { data } = byteString
            const [task, payload] = JSON.parse( data )

            switch ( task ) {
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