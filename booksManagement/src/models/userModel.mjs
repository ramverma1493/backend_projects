import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        enum: ['Mr', 'Mrs', 'Miss']
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },

    address: {
        street: { type: String },
        city: { type: String },
        pincode: { type: String }
    }
},
    {
        timestamps: true
    })

const userModel = mongoose.model('user', userSchema)

export { userModel }