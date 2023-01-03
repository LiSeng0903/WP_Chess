import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import wsConnect from "./wsConnect.js"
import { Game } from './Game.js'

const SERVER_IP = 'localhost'

const app = express()
const server = http.createServer( app )
const serverWS = new WebSocket.Server( { server } )

let game = ''

game = new Game()
serverWS.on( "connection", ( ws ) => {
    ws.onmessage = wsConnect.do( ws, serverWS, game )
} )

const PORT = 4000
server.listen( PORT, SERVER_IP, () => {
    console.log( `server is on ${PORT}` )
} )