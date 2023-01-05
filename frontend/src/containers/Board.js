import styled from "styled-components"

import { useChess } from "./hooks/useChess"
import { Grid } from "../components/Grid"
import { WaitModal } from "../components/WaitModal"
import { ResultModal } from "../components/ResultModal"
import { Button, Modal } from 'antd'
import deskIMG from '../imgs/marble.jpg'
import borderIMG from '../imgs/chessBorder.jpg'

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


const FullBoardWrapper = styled.div`
    width:100%;
    height:100%;
    background-image: url(${deskIMG});
    background-size: cover;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

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
    height: 85vh;
    width: 85vh;
    background-color: #c4afac;
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-color: black;
    
`

const BoardRowWrapper = styled.div`
    height: 12.5%;
    width: 100%;
    background-color: #dfc8c5;
    display: flex;
    flex-direction: row;
`

const LeftWrapper = styled.div`
    height: 100vh;
    width: 270px;
    background-color: gray;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const RightWrapper = styled.div`
    height: 100vh;
    width: 270px;
    background-color: gray;
    display: flex;
    flex-direction: column;
`

const ChessBoardWrapper = styled.div`
    height: 90vh;
    width: 90vh;
    background-image: url(${borderIMG});
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Board = () => {
    const { board, focusP, setFocusP, preview, move, turn, myColor, winner, roomNumber, name, opponentName, waitingForOpponent, status, otherConnect, backToLogin, endGame } = useChess()

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
        <FullBoardWrapper>
            <LeftWrapper style={{ backgroundColor: "transparent" }}>
                <p style={{ alignSelf: "flex-start", fontFamily: "Comic Sans MS", fontSize: "20px" }}>&ensp;Room Number: {roomNumber}</p>
                {status === "" ? null : <p style={{ alignSelf: "center", fontFamily: "Comic Sans MS", fontSize: "30px", color: "black"}}>{status}!</p>}
                <p style={{ alignSelf: "flex-end", fontFamily: "Comic Sans MS", fontSize: "35px" }}>{name}&ensp;</p>
            </LeftWrapper>
            <ChessBoardWrapper id="chess">
                <BoardWrapper id="board">
                    {
                        myColor == 'w' ? (
                            board.map( ( row, x ) => {
                                return (
                                    <BoardRowWrapper>
                                        {row.map( ( grd, y ) => {
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
                    {endGame ? <ResultModal win={myColor == winner} /> : ( myColor == turn ? ( waitingForOpponent == true ? <WaitModal waitingJoin="true" /> : <></> ) : <WaitModal waitingJoin="false" /> )}
                </BoardWrapper>
            </ChessBoardWrapper>
            <RightWrapper style={{ backgroundColor: "transparent" }}>
                <p style={{ alignSelf: "flex-start", fontFamily: "Comic Sans MS", fontSize: "35px" }}>&ensp;{opponentName}</p>
            </RightWrapper>
            <Modal
                open={otherConnect}
                title="Error"
                footer={[
                    <Button key="Back to Login Page" type="primary" onClick={backToLogin}>
                        Back to Login Page
                    </Button>
                ]}
            >
                <p>Ops... your account is logged in from other place...</p>
                <p>Please return to the login page.</p>
            </Modal>
        </FullBoardWrapper>
    )
}

export { Board }