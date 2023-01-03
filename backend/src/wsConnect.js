import { Game } from "./Game.js"

const sendData = ( data, clientWS ) => {
    clientWS.send( JSON.stringify( data ) )
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
                    games[newGame.GameID] = newGame

                    // store name 
                    connections[connectionID].name = name

                    // send message 
                    sendData( ['createRoomSuccess', [newGame, 'w', newGame.GameID]], clientWS )
                    break
                }
                case "joinRoom": {
                    // get info
                    let [gameID, name] = payload

                    // store name
                    connections[connectionID].name = name

                    // join game 
                    let game = games[gameID]

                    // not exist game 
                    if ( games[gameID] == undefined ) {
                        sendData( ['joinRoomFailed', 'Game doesn\'t exist'] )
                        return
                    }

                    if ( game.player_join( connectionID ) ) {
                        sendData( ['joinRoomSuccess', [game, 'b', gameID]], clientWS )

                        // Game start
                        let wConnection = connections[game.wID]
                        let bConnection = connections[game.bID]

                        console.log( 'start game to w' )
                        sendData( ['gameStarted', [game, bConnection.name]], wConnection.ws )
                        console.log( 'start game to b' )
                        sendData( ['gameStarted', [game, wConnection.name]], bConnection.ws )
                    }
                    else {
                        sendData( ['joinRoomFailed', 'Game is full'] )
                        return
                    }
                    break
                }
                case "preview": {
                    // const newBoard = game.preview( payload )
                    // const turn = game.turn
                    // sendData( ["do", { newBoard, turn }], clientWS )
                    // break
                }
                case "move": {
                    // const { from, to } = payload
                    // const newBoard = game.move( from, to )
                    // const turn = game.turn
                    // boardcastMessage( serverWS, ["do", { newBoard, turn }] )
                    // break
                }
            }
        } ) )
    }
}