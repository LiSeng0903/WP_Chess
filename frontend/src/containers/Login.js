import styled from "styled-components"
import Enter from "../components/Enter"
import { useChess } from "./hooks/useChess"
import RegisterModal from "../components/RegisterModal"

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
    const { loginErrorMsg, loginError, setLoginError } = useChess()

    return (
        <LoginWrapper>
            <Title style={{ fontFamily: "Comic Sans MS" }}>Login</Title>
            <p style={{ opacity: loginError ? "1" : "0", color: "red" }}>{loginErrorMsg}</p>
            <Enter
                setLoginError={setLoginError}
            />
            <RegisterModal />
        </LoginWrapper>
    )
}

export default Login