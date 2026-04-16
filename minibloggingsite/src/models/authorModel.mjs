import mongoose from 'mongoose'

const authorSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    title: {
        type: String,
        required: true,
        enum: {
            values: ['Mr', 'Mrs', 'Miss'],
            message: '{VALUE} is not supported'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, "Invalid email"]
    },
    password: { type: String, required: true }
})

let authorModel = mongoose.model('author', authorSchema)

export {authorModel}