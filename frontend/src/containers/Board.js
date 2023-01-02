import styled from "styled-components"

import { useChess } from "./hooks/useChess"
import { Grid } from "../components/Grid"
import { WaitModal } from "../components/WaitModal"
import { ResultModal } from "../components/ResultModal"

// import images 
import blackBishopImg from '../imgs/blackBishop.png'
import blackKingImg from '../imgs/blackKing.png'
import blackKnightImg from '../imgs/blackKnight.png'
import blackPawnImg from '../imgs/blackPawn.png'
import blackQueenImg from '../imgs/blackQueen.png'
import blackRookImg from '../imgs/blackRook.png'
import whiteBishopImg from '../imgs/whiteBishop.png'
import whiteKingImg from '../imgs/whiteKing.png'
import whiteKnightImg from '../imgs/whiteKnight.png'
import whitePawnImg from '../imgs/whitePawn.png'
import whiteQueenImg from '../imgs/whiteQueen.png'
import whiteRookImg from '../imgs/whiteRook.png'

const imgDict = {
    'pawn': {
        'w': whitePawnImg,
        'b': blackPawnImg
    },
    'bishop': {
        'w': whiteBishopImg,
        'b': blackBishopImg
    },
    'rook': {
        'w': whiteRookImg,
        'b': blackRookImg
    },
    'knight': {
        'w': whiteKnightImg,
        'b': blackKnightImg
    },
    'king': {
        'w': whiteKingImg,
        'b': blackKingImg
    },
    'queen': {
        'w': whiteQueenImg,
        'b': blackQueenImg
    },
    'nothing': {
        'nothing': undefined
    }
}

const BoardWrapper = styled.div`
    height: 100vh;
    width: 100vh;
    background-color: #c4afac;
    display: flex;
    flex-direction: column;
    
`

const BoardRowWrapper = styled.div`
    height: 12.5%;
    width: 100%;
    background-color: #dfc8c5;
    display: flex;
    flex-direction: row;
`

const Board = () => {
    const { board, focusP, setFocusP, preview, move, turn, myColor, winner } = useChess()

    const clickHandler = ( x, y ) => {
        // not your turn 
        if ( turn != myColor ) return
        if ( winner != '' ) return

        // preview 
        if ( board[ x ][ y ].color == myColor ) {
            setFocusP( [ x, y ] )
            preview( [ x, y ] )
        }
        // move 
        else if ( board[ x ][ y ].ava == true ) {
            move( focusP, [ x, y ] )
            setFocusP( [] )
        }
        // cancel preview
        else {
            setFocusP( [] )
            preview( [] )
        }
    }

    return (
        <BoardWrapper>
            {
                myColor == 'w' ? (
                    board.map( ( row, x ) => {
                        return (
                            <BoardRowWrapper>
                                {row.map( ( grd, y ) => {
                                    console.log( focusP )
                                    return (
                                        <Grid x={x} y={y} image={imgDict[ grd.type ][ grd.color ]} ava={grd.ava} isFocus={( focusP[ 0 ] == x && focusP[ 1 ] == y )} clickHandler={( event ) => { clickHandler( x, y ) }} />
                                    )
                                } )}
                            </BoardRowWrapper>
                        )
                    } )
                ) :
                    (
                        board.slice( 0 ).reverse().map( ( row, x ) => {
                            return (
                                <BoardRowWrapper>
                                    {row.slice( 0 ).reverse().map( ( grd, y ) => {
                                        return (
                                            <Grid x={7 - x} y={7 - y} image={imgDict[ grd.type ][ grd.color ]} ava={grd.ava} isFocus={( focusP[ 0 ] == 7 - x && focusP[ 1 ] == 7 - y )} clickHandler={( event ) => { clickHandler( 7 - x, 7 - y ) }} />
                                        )
                                    } )}
                                </BoardRowWrapper>
                            )
                        } )
                    )

            }
            {winner ? <ResultModal win={myColor == winner} /> : ( myColor == turn ? <></> : <WaitModal /> )}
        </BoardWrapper>
    )
}

export { Board }