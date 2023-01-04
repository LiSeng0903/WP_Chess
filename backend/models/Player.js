import mongoose from "mongoose"

const Schema = mongoose.Schema

const PlayerSchema = new Schema( {
    name: {
        type: String,
        required: [true, 'Name field is missed']
    },
    password: {
        type: String,
        required: [true, 'Password field is missed']
    },
} )

const Player = mongoose.model( 'players', PlayerSchema )
export { Player }