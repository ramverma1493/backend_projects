import { redis_URL } from "../../config.mjs";
import { createClient } from "redis";

const redisClient = createClient({url: redis_URL})

redisClient.on('error', (err) => {
    console.log({Redis_error : err})
})

await redisClient.connect()

console.log('Redis Connected')

export {redisClient}