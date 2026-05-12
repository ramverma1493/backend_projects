import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    urlcode: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    longurl: {
        type: String,
        required: true,
        match: /https?:\/\/.+/
    },
    shorturl: {
        type: String,
        required: true,
        unique: true
    }
})

let urlModel = mongoose.model('url', urlSchema)

export {urlModel}