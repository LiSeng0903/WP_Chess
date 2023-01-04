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
const SERVER_IP = 'localhost'
// const SERVER_IP = '192.168.0.144'
const INIT = true

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
        connections[ connectionID ] = {
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

    const testPlayers = [
        { name: 'Ali', password: '11111111' },
        { name: 'Pui', password: '22222222' },
        { name: 'Lia', password: '33333333' }
    ]

    for ( let player of testPlayers ) {
        const testPlayer = new Player( { name: player.name, password: bcrypt.hashSync( player.password, 10 ) } )
        try {
            await testPlayer.save()
            console.log( 'init success' )
        }
        catch ( error ) {
            throw new Error( 'Message DB save error' + error )
        }
    }

}