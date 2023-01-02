import styled from "styled-components"

import { Board } from "./Board"
import { useChess } from "./hooks/useChess"

const AppWrapper = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
`

function App() {
  const {name, setName} = useChess();

  return (
    <AppWrapper className="App" style={{ display: 'flex' }}>
      <Board />
    </AppWrapper>
  )
}

export default App
