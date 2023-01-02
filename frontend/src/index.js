import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './containers/App'

import { ChessProvider } from "./containers/hooks/useChess.js"

const root = ReactDOM.createRoot( document.getElementById( 'root' ) )
root.render(
  <React.StrictMode>
    <ChessProvider>
      <App />
    </ChessProvider>
  </React.StrictMode>
)