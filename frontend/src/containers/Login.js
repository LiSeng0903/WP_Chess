import styled from "styled-components"
import Enter from "../components/Enter"
import { useChess } from "./hooks/useChess"

const LoginWrapper = styled.div`
    height: 100%;
    width: 600px;
    background-color: cyan;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Title = styled.div`
    height: 300px;
    width: 500px;
    background-color: pink;
    display: flex;
    flex-direction: center;
`

const handleLogIn = () => {

}

const Login = () => {
    const { name, setName, roomNumber, setRoomNumber } = useChess()

    return (
        <LoginWrapper>
            <Title>Login</Title>
            <Enter
                me={name}
                setName={setName}
                roomNumber={roomNumber}
                setRoomNumber={setRoomNumber}
                onLogin={handleLogIn} />
        </LoginWrapper>
    )
}

export default Login