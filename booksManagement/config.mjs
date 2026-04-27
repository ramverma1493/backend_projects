import dotenv from 'dotenv'
dotenv.config()

const uri = process.env.MongoDB
const PORT = process.env.PORT
const jwtScretKey = process.env.jwtScretKey

export {uri, PORT, jwtScretKey}