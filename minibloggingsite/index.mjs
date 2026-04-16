import express from 'express'
import router from './src/route.mjs'
import { uri, PORT } from './config.mjs'
import mongoose from 'mongoose'

const app = express()

mongoose.connect(uri).then(() => {
    console.log('connected to database')
}).catch((err) => {
    console.log(err)
})

app.use(express.json())

app.use('/', router)

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})