// Import libraries 
import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import wsConnect from "./wsConnect.js"
import { uuid } from 'uuidv4'
import mongoose from "mongoose"
import mongo from './mongo.js'

// Constant 
const SERVER_IP = 'localhost'

//mongoose connection
mongoose.set( 'strictQuery', false )
mongo.connect()

// Server 
const app = express()
const server = http.createServer( app )
const serverWS = new WebSocket.Server( { server } )
const db = mongoose.connection

// Store infomations 
let games = [] // list of Game object 
let connections = [] // list of connection info, index is connection ID; { ws:.., name:.., game:.. }

db.once( 'open', () => {
    console.log( 'db connected' )

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
    } )
} )

const PORT = process.env.PORT || 4000
server.listen( PORT, SERVER_IP, () => {
    console.log( `server is on ${PORT}` )
} )
