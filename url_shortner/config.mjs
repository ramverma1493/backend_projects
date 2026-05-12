import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.MongoDB
const PORT = process.env.PORT
const redis_URL = process.env.redis_URL

export {uri, PORT, redis_URL}