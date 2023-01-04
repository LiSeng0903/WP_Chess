import mongoose from "mongoose"

const Schema = mongoose.Schema

const PlayerSchema = new Schema( {
    name: {
        type: String,
        required: [true, 'Name field is missed'],
        unique: [true, 'Name is used']
    },
    password: {
        type: String,
        required: [true, 'Password field is missed']
    }
} )

const Player = mongoose.model( 'players', PlayerSchema )
export { Player }