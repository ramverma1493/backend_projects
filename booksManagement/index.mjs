import express from 'express'
import route from './src/route.mjs'
import { uri, PORT } from './config.mjs'
import mongoose from 'mongoose'

mongoose.connect(uri).then(() => {
    console.log('connected to database')
}).catch((err) => {
    console.log(err)
})


const app = express()

app.use(express.json())

app.use('/', route)

app.listen(PORT, () => {
    console.log(`listing to port ${PORT}`)
})