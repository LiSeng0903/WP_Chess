import styled from "styled-components"

const ResultModalWrapper = styled.div`
    height: 100px;
    width: 400px;
    position: absolute;
    background-color: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.5;
`

const ResultTextWrapper = styled.div`
    height:100px;
    width:350px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    text-align: center;
    text-decoration-line: overline underline;
    color: #550a0a;
    font-weight: bold;
    border-radius: 20px;
`

const ResultModal = ( { win } ) => {
    return (
        <>
            <ResultModalWrapper>
            </ResultModalWrapper>
            <ResultTextWrapper>
                <p>♛ You {win ? 'Win!' : 'Lose'} ♛</p>
            </ResultTextWrapper>
        </>
    )
}

export { ResultModal }