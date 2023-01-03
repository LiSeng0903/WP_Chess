import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import wsConnect from "./wsConnect.js"
import { uuid } from 'uuidv4'

const sendData = ( data, clientWS ) => {
    clientWS.send( JSON.stringify( data ) )
}

// const SERVER_IP = 'localhost' 
const SERVER_IP = '192.168.0.143'

const app = express()
const server = http.createServer( app )
const serverWS = new WebSocket.Server( { server } )

// let game = ''
let games = []
let connections = []

// game = new Game()
serverWS.on( "connection", ( clientWS ) => {
    // store connection 
    let connectionID = uuid()
    connections[connectionID] = {
        ws: clientWS,
        name: '',
        game: ''
    }

    // connect & send playerID
    console.log( 'player connect' )
    sendData( ['connectionID', connectionID], clientWS )

    // on message 
    clientWS.onmessage = wsConnect.onMessage( clientWS, games, connections, connectionID )
} )

const PORT = 4000
server.listen( PORT, SERVER_IP, () => {
    console.log( `server is on ${PORT}` )
} )
