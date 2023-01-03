import styled from "styled-components"
import Enter from "../components/Enter"
import { useChess } from "./hooks/useChess"

const LoginWrapper = styled.div`
    height: 100%;
    width: 600px;
    background-color: #0c531c;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Title = styled.div`
    background-color: #25803b;
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

const Login = () => {
    const { name, setName, roomNumber, setRoomNumber, loginError, setLoginError } = useChess()

    return (
        <LoginWrapper>
            <Title style={{ fontFamily: "Comic Sans MS" }}>Chess!</Title>
            <p style={{ opacity: loginError ? "1" : "0", color: "red" }}>Please Enter a Valid Room Number or a User Name.</p>
            <Enter
                me={name}
                setName={setName}
                roomNumber={roomNumber}
                setRoomNumber={setRoomNumber}
                setLoginError={setLoginError}
            />
        </LoginWrapper>
    )
}

export default Login