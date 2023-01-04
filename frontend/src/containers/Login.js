import styled from "styled-components"
import Enter from "../components/Enter"
import { useChess } from "./hooks/useChess"
import RegisterModal from "../components/RegisterModal"
import chessIMG from "../imgs/chess.jpg"

const FullLoginWrapper = styled.div`
    height:100%;
    width:100%;
    background-image: url(${chessIMG});
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const LoginWrapper = styled.div`
    height: 50%;
    width: 400px;
    background-color: rgba(0,0,0,0.6) !important;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
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
const FooterStyle = styled.div`
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    white-space: break-spaces;
`

const HeaderStyle = styled.div`
   
`

const Login = () => {
    const { loginErrorMsg, loginError, setLoginError } = useChess()

    return (
        <FullLoginWrapper>
            <LoginWrapper>
                <HeaderStyle></HeaderStyle>
                <div>
                    <Title style={{ fontFamily: "Comic Sans MS" }}>Login to Chess</ Title>
                    <p style={{ opacity: loginError ? "1" : "0", color: "red" }}>{loginErrorMsg}</p>
                    <Enter
                        setLoginError={setLoginError}
                    />
                </div>
                <FooterStyle>
                    <p>Don't have an account?  </p>
                    <RegisterModal />
                </FooterStyle>
            </LoginWrapper>
        </FullLoginWrapper>
    )
}

export default Login