// Import libraries 
import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import wsConnect from "./wsConnect.js"
import { uuid } from 'uuidv4'

// Constant 
const SERVER_IP = 'localhost'

// Server 
const app = express()
const server = http.createServer( app )
const serverWS = new WebSocket.Server( { server } )

// Store infomations 
let games = [] // list of Game object 
let connections = [] // list of connection info, index is connection ID; { ws:.., name:.., game:.. }

serverWS.on( "connection", ( clientWS ) => {

    // store connection 
    let connectionID = uuid()
    connections[connectionID] = {
        ws: clientWS,
        name: '',
        game: ''
    }

    clientWS.onmessage = wsConnect.onMessage( clientWS, connectionID, games, connections )
    console.log( 'player connect' )

    const PORT = 4000
    server.listen( PORT, SERVER_IP, () => {
        console.log( `server is on ${PORT}` )
    } )
} )
