import styled from "styled-components"

import { Board } from "./Board"
import { useChess } from "./hooks/useChess"
import Login from "./Login"

const AppWrapper = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
`

function App() {
  const { hasStarted, setHasStarted } = useChess()

  return (
    <AppWrapper className="App" style={{ display: 'flex' }}>
      {!hasStarted ? <Login /> : <Board />}
    </AppWrapper>
  )
}

export default App
