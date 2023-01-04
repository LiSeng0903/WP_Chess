import styled from "styled-components"

import { Board } from "./Board"
import { useChess } from "./hooks/useChess"
import Join from "./Join"
import Login from "./Login"

const AppWrapper = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
`

function App() {
  const { hasLogin, setHasLogin, hasStarted, setHasStarted } = useChess()

  return (
    <AppWrapper className="App" style={{ display: 'flex' }}>
      {!hasLogin ? <Login /> : !hasStarted ? <Join /> : <Board />}
    </AppWrapper>
  )
}

export default App
