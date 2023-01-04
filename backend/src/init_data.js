// import 
import bcrypt from 'bcryptjs'

import { Player } from "../models/Player.js"

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

export { init_test_player }