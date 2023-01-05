// Import libraries 
import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import { uuid } from 'uuidv4'
import mongoose from "mongoose"

import wsConnect from "./wsConnect.js"
import mongo from './mongo.js'
import { init_test_player } from "./init_data.js"

// Constant 
const SERVER_IP = 'localhost'
// const SERVER_IP = '192.168.0.144'
const INIT = false

//mongoose connection
mongoose.set( 'strictQuery', false )
mongo.connect()

// Server 
const app = express()
const server = http.createServer( app )
const serverWS = new WebSocket.Server( { server } )
const db = mongoose.connection

// Store infomations 
let games = [] // list of Game object, [gameID] = {wID, bID, ...}
let connections = [] // list of connection info, [connectionID] = {playerID}
let playerConnections = [] // list of player info, [playerID] = {ws, gameID, connectionID}

db.once( 'open', () => {
    console.log( 'db connected' )
    if ( INIT ) init_test_player()

    serverWS.on( "connection", ( clientWS ) => {
        // store connection 
        let connectionID = uuid()

        connections[ connectionID ] = {
            playerID: '',
        }

        clientWS.onmessage = wsConnect.onMessage( clientWS, connectionID, games, connections, playerConnections )
        console.log( 'player connect' )
    } )
} )

const PORT = process.env.PORT || 4000
server.listen( PORT, SERVER_IP, () => {
    console.log( `server is on ${PORT}` )
} )