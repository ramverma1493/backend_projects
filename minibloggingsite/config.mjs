import dotenv from 'dotenv'
dotenv.config()

const uri = process.env.MongoDB
const PORT = process.env.PORT
const SecretKey = process.env.SecretKey

export {uri, PORT, SecretKey}