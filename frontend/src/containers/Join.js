import styled from "styled-components"
import { useChess } from "./hooks/useChess"
import { Input, Space, Button, Modal } from 'antd'
import chessIMG from "../imgs/chess.jpg"
import "../index.css"

const { Search } = Input

const FullJoinWrapper = styled.div`
    height:100%;
    width:100%;
    background-image: url(${chessIMG});
    background-size: 1450px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const JoinWrapper = styled.div`
    height: 50%;
    width: 400px;
    background-color: rgba(0,0,0,0.6) !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
`

const Title = styled.div`
    height: 50px;
    width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: white;
    font-family: "Comic Sans MS"
`

const SearchWrapper = styled.div`
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;

    span{
        background-color: transparent;
        &:hover{
            border-color: brown !important;
        }
        &:focus{
            border-color: brown !important;
        }
        &:focus-visible{
            border-color: brown !important;
            outline-color: brown;
        }
    }

    input{
        background-color: transparent;
    }


    button{
        height:33px !important;
        background-color: brown;
        opacity: .6;
       
        &:hover{
            background-color: brown !important;
            opacity: 1;
        }
    }
`
const HeaderStyle = styled.div`
   
`

const FooterStyle = styled.div`
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    white-space: break-spaces;
`
const SearchStyle = styled(Search)`
    background-color:transparent;
`

const ButtonStyle = styled(Button)`
    background-color: brown;
    width: 200px;
    opacity: .5;
    
    &:hover{
        background-color: brown !important;
        opacity: 1;
    }
`

const Join = () => {
    const { joinError, createRoom, joinRoom, otherConnect, backToLogin } = useChess()

    return (
        <FullJoinWrapper>
            <HeaderStyle></HeaderStyle>
            <JoinWrapper>
                <Title style={{ fontFamily: "Comic Sans MS" }}>Find your Chess Room</Title>
                <p style={{ opacity: joinError ? "1" : "0", color: "red", margin: "5px" }}>Please Enter a Valid Room Number.</p>
                <SearchWrapper>
                    <SearchStyle
                        id="search"
                        placeholder="Enter a Room Number"
                        allowClear
                        enterButton="Join!"
                        size="meduim"
                        onSearch={( value ) => joinRoom( value )}
                        autoComplete="off"
                    />
                    <p style={{ fontFamily: "cursive", fontSize: "20px", margin: "10px", color: "white"}}>or</p>
                    <ButtonStyle type="primary" onClick={createRoom}>Create a Room</ButtonStyle>
                </SearchWrapper>
            </JoinWrapper>
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
            <FooterStyle></FooterStyle>
        </FullJoinWrapper>
        
    )
}

export default Join