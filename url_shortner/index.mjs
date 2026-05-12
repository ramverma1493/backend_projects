import express from 'express'
import mongoose from 'mongoose'
import { uri, PORT } from './config.mjs'
import router from './src/route.mjs'

const app = express()

mongoose.connect(uri).then(() => {
    console.log('Connected to data base')
}).catch((err) => {
    console.log(err)
})

app.use(express.json())

app.use('/', router)

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})