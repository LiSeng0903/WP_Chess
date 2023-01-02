import styled from "styled-components"

const WaitModalWrapper = styled.div`
    height: 100px;
    width: 450px;
    position: absolute;
    background-color: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.5;
    border-radius: 20px;
`

const WaitTextWrapper = styled.div`
    height:100px;
    width:400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    text-align: center;
    text-decoration-line: overline underline;
    color: #1b310d;
    font-weight: bold;
`

const WaitModal = () => {
    return (
        <>
            <WaitModalWrapper>
            </WaitModalWrapper>
            <WaitTextWrapper>
                <p>♛ Waiting for opponent ♛</p>
            </WaitTextWrapper>
        </>
    )
}

export { WaitModal }