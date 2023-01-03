import { Game } from "./Game.js"

const sendData = ( data, clientWS ) => {
    clientWS.send( JSON.stringify( data ) )
    return
}

const boardcastDataToGame = ( gameID, data, games, connections ) => {
    let game = games[gameID]
    let wWS = connections[game.wID].ws
    let bWS = connections[game.bID].ws

    sendData( data, wWS )
    sendData( data, bWS )
    return
}

const boardcastData = ( serverWS, data ) => {
    serverWS.clients.forEach( ( clientWS ) => {
        sendData( data, clientWS )
    } )
}

// game = {
//     gameId: String,
//     board: [[{
//         type:...
//         color: ...
//         ava: ...
//     }] * 8] * 8,
//     turn: 'w' || 'b',
// }

export default {
    onMessage: ( clientWS, games, connections, connectionID ) => {
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

                    // join game 
                    let game = games[gameID]

                    // store name
                    connections[connectionID].name = name

                    // not exist game 
                    if ( games[gameID] == undefined ) {
                        sendData( ['joinRoomFailed', 'Game doesn\'t exist'], clientWS )
                        return
                    }

                    if ( game.player_join( connectionID ) ) {
                        connections[connectionID].game = game
                        sendData( ['joinRoomSuccess', [game, 'b', gameID]], clientWS )

                        // Game start
                        let wConnection = connections[game.wID]
                        let bConnection = connections[game.bID]

                        sendData( ['gameStarted', [game, bConnection.name]], wConnection.ws )
                        sendData( ['gameStarted', [game, wConnection.name]], bConnection.ws )
                    }
                    else {
                        sendData( ['joinRoomFailed', 'Game is full'], clientWS )
                        return
                    }
                    break
                }
                case "preview": {
                    let game = connections[connectionID].game
                    sendData( ["do", game], clientWS )
                    break
                }
                case "move": {
                    let game = connections[connectionID].game
                    const { from, to } = payload

                    const newBoard = game.move( from, to )
                    const turn = game.turn
                    boardcastDataToGame( game.GameID, ['do', game], games, connections )
                    break
                }
            }
        } ) )
    }
}