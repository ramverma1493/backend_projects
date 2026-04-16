import dotenv from 'dotenv'
dotenv.config()

const uri = process.env.MongoDB
const PORT = process.env.PORT

export {uri, PORT}