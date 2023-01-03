import { createContext, useContext, useEffect, useState } from "react"

const SERVER_IP = '192.168.0.143'
const clientWS = new WebSocket( 'ws://' + SERVER_IP + ':4000' )

const sendData = async ( data ) => {
    await clientWS.send( JSON.stringify( data ) )
}

const ChessContext = createContext(
    {
        hasStarted: Boolean,
        setHasStarted: () => {},

        board: [], // 8*8 metrix 
        setBoard: () => {},

        turn: '', // 'w' or 'b'
        setTurn: () => {},

        myColor: '', // 'w' or 'b'
        setMyColor: () => {},

        focusP: [],
        setFocusP: () => {},

        winner: '',
        setWinner: () => {},

        name: "", //player name
        setName: () => {},

        opponentName: "", //opponent name
        setOpponentName: () => {},

        roomNumber: "", //play room number (string)
        setRoomNumber: () => {},

        connectionID: "",
        setConnectionID: () => {},

        loginError: Boolean, //determone if user has enter correct or valid info
        setLoginError: () => {},

        preview: () => {},
        move: () => {},
        createRoom: () => {},
        joinRoom: () => {},
    }
)


const ChessProvider = ( props ) => {
    const [ hasStarted, setHasStarted ] = useState( false )
    const [ board, setBoard ] = useState( [] )
    const [ turn, setTurn ] = useState( '' )
    const [ myColor, setMyColor ] = useState( '' )
    const [ focusP, setFocusP ] = useState( [] )
    const [ winner, setWinner ] = useState( '' )
    const [ name, setName ] = useState( "Alistone" )
    const [ opponentName, setOpponentName ] = useState( "Pusung" )
    const [ roomNumber, setRoomNumber ] = useState( "Welcome!" )
    const [ connectionID, setConnectionID ] = useState( "" )
    const [ loginError, setLoginError ] = useState( false )



    // sending
    const preview = ( previewPos ) => {
        // get preview board 
        sendData( [ "preview", previewPos ] )
    }

    const move = ( from, to ) => {
        // get moved board 
        sendData( [ "move", { from, to } ] )
    }

    const init = () => {
        // get initial board 
        sendData( [ 'init' ] )
    }

    const createRoom = ( name ) => {
        // first person create a game room
        sendData( [ "createRoom", name ] )
    }

    const joinRoom = ( roomNumber, name ) => {
        // second person join a room
        sendData( [ "joinRoom", [ roomNumber, name ] ] )
    }


    // receiving
    clientWS.onmessage = ( byteString ) => {
        const { data } = byteString
        const [ task, response ] = JSON.parse( data )
        switch ( task ) {

            case "connectionID": {
                const ID = response
                console.log( "receive id", ID )
                break
            }

            case "createRoomSuccess": {
                const [ game, playerColor, gameID ] = response
                setHasStarted( true )
                setBoard( game.board )
                setTurn( game.turn )
                setMyColor( playerColor )
                setRoomNumber( gameID )
                break
            }

            case "joinRoomSuccess": {
                const [ game, playerColor, gameID ] = response
                setHasStarted( true )
                setBoard( game.board )
                setTurn( game.turn )
                setMyColor( playerColor )
                setRoomNumber( gameID )
                break
            }

            case "gameStarted": {
                console.log( "get game started" )
                const [ newGame, opName ] = response
                setBoard( newGame.board )
                setTurn( newGame.turn )
                setOpponentName( opName )
                break
            }

            case "init": {
                const { newBoard, turn, playerColor } = response
                setBoard( newBoard )
                setTurn( turn )
                setMyColor( playerColor )
                break
            }

            case "do": {
                const { newBoard, turn } = response
                setBoard( newBoard )
                setTurn( turn )
                break
            }
        }
    }

    useEffect( () => {
        // init()
        console.log( `My color is ${myColor == 'w' ? 'white' : 'black'}` )
    }, [] )

    useEffect( () => {
        setWinner( checkWinner() )
    }, [ board ] )

    const checkWinner = () => {
        if ( board.length == 0 ) {
            return ''
        }
        let winner = ''
        let whiteKing = false
        let blackKing = false
        for ( let x = 0; x < 8; x++ ) {
            for ( let y = 0; y < 8; y++ ) {
                if ( board[ x ][ y ].type == 'king' ) {
                    if ( board[ x ][ y ].color == 'w' ) {
                        whiteKing = true
                    }
                    else {
                        blackKing = true
                    }
                }
            }
        }

        if ( blackKing == false ) {
            winner = 'w'
        }
        else if ( whiteKing == false ) {
            winner = 'b'
        }
        else {
            winner = ''
        }

        return winner
    }



    return (
        <ChessContext.Provider
            value={
                {
                    hasStarted,
                    setHasStarted,

                    board,
                    setBoard,

                    turn,
                    setTurn,

                    myColor,
                    setMyColor,

                    focusP,
                    setFocusP,

                    winner,
                    setWinner,

                    name,
                    setName,

                    opponentName,
                    setOpponentName,

                    roomNumber,
                    setRoomNumber,

                    loginError,
                    setLoginError,

                    preview,
                    move,
                    createRoom,
                    joinRoom,
                }
            }
            {...props}
        />
    )
}

const useChess = () => { return useContext( ChessContext ) }
export { useChess, ChessProvider }