import { Game } from "./Game.js"

const sendData = ( data, clientWS ) => {
    clientWS.send( JSON.stringify( data ) )
}

const boardcastMessage = ( serverWS, data ) => {
    serverWS.clients.forEach( client => {
        sendData( data, client )
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
    do: ( clientWS, serverWS, games, connections, connectionID ) => {
        return ( ( async ( byteString ) => {
            const { data } = byteString
            const [task, payload] = JSON.parse( data )
            switch ( task ) {
                case "createRoom": {
                    // create game 
                    let newGame = new Game()
                    newGame.player_join( connectionID )

                    // store game 
                    games[newGame.GameID] = newGame

                    // send message 
                    sendData( ['createRoomSuccess', [newGame, 'w', newGame.GameID]], clientWS )
                    break
                }
                case "joinRoom": {
                    let gameID = payload

                    // join game 
                    let game = games[gameID]
                    if ( game.player_join( connectionID ) ) {
                        sendData( ['joinRoomSuccess', [game, 'b', gameID]], clientWS )
                    }
                    else {
                        sendData( ['joinRoomFailed'] )
                    }

                    break
                }
                case "init": {
                    // console.log( "player connected" )
                    // const newBoard = game.board
                    // const turn = game.turn
                    // let playerColor = ''
                    // if ( game.playerCnt === 1 ) {
                    //     playerColor = 'b'
                    // } else {
                    //     playerColor = 'w'
                    //     game.playerCnt++
                    // }
                    // sendData( ["init", { newBoard, turn, playerColor }], clientWS )
                    // break
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