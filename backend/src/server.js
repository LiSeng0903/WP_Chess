// Import libraries 
import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import wsConnect from "./wsConnect.js"
import { uuid } from 'uuidv4'
import mongoose from "mongoose"
import mongo from './mongo.js'
import { Player } from "../models/Player.js"
import bcrypt from 'bcryptjs'

// Constant 
// const SERVER_IP = 'localhost'
const SERVER_IP = '192.168.0.144'
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
let games = [] // list of Game object 
let connections = [] // list of connection info, index is connection ID; { ws:.., name:.., game:.. }

db.once( 'open', () => {
    console.log( 'db connected' )
    if ( INIT ) init_test_player()

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

const init_test_player = async () => {
    await Player.remove( {} )

    const testName = 'Ali'
    const testPassword = '11111111'

    const testPlayer = new Player( { name: testName, password: bcrypt.hashSync( testPassword, 10 ) } )
    try {
        await testPlayer.save()
        console.log( 'init success' )
    }
    catch ( error ) {
        throw new Error( 'Message DB save error' + error )
    }
}