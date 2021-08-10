import mongoose from "mongoose";
import { Schema, model } from "mongoose";



const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    }, 
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        ref: "Role",
        type: mongoose.Schema.Types.ObjectId,
    }]
}, {
    timestamp: true,
    versionKey: false
});



export default model('User', userSchema);