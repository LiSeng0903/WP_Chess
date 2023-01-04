import styled from "styled-components"
import { useChess } from "./hooks/useChess"
import { Input, Space, Button } from 'antd'

const { Search } = Input

const JoinWrapper = styled.div`
    height: 100%;
    width: 600px;
    background-color: #8a0e0e;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Title = styled.div`
    background-color: #dd1616;
    height: 300px;
    width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family:cursive;
    font-style: oblique;
    font-size: 80px
`

const SearchWrapper = styled.div`
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Join = () => {
    const { joinError, createRoom, joinRoom } = useChess()

    return (
        <JoinWrapper>
            <Title style={{ fontFamily: "Comic Sans MS" }}>Chess!</Title>
            <p style={{ opacity: joinError ? "1" : "0", color: "red" }}>Please Enter a Valid Room Number.</p>
            <SearchWrapper>
                <Search
                    placeholder="Enter a Room Number"
                    allowClear
                    enterButton="Join!"
                    size="meduim"
                    onSearch={( value ) => joinRoom( value )}
                />
                <p style={{ fontFamily: "cursive", fontStyle: "oblique", fontSize: "30px" }}>or</p>
                <Button type="primary" onClick={createRoom}>Create a Room</Button>
            </SearchWrapper>
        </JoinWrapper>
    )
}

export default Join