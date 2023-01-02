import { Game } from "./Game.js"

const sendData = ( data, ws ) => {
    ws.send( JSON.stringify( data ) )
}

const boardcastMessage = ( wss, data ) => {
    wss.clients.forEach( client => {
        sendData( data, client )
    } )
}


export default {
    do: ( ws, wss, game ) => {
        return ( ( async ( byteString ) => {
            const { data } = byteString
            const [ task, payload ] = JSON.parse( data )
            switch ( task ) {
                case "init": {
                    console.log( "player connected" )
                    const newBoard = game.board
                    const turn = game.turn
                    let playerColor = ''
                    if ( game.playerCnt === 1 ) {
                        playerColor = 'b'
                    } else {
                        playerColor = 'w'
                        game.playerCnt++
                    }
                    sendData( [ "init", { newBoard, turn, playerColor } ], ws )
                    break
                }
                case "preview": {
                    const newBoard = game.preview( payload )
                    const turn = game.turn
                    sendData( [ "do", { newBoard, turn } ], ws )
                    break
                }
                case "move": {
                    const { from, to } = payload
                    const newBoard = game.move( from, to )
                    const turn = game.turn
                    boardcastMessage( wss, [ "do", { newBoard, turn } ] )
                    break
                }
            }
        } ) )
    }
}