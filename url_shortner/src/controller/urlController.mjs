import { urlModel } from "../models/urlModel.mjs";
import { nanoid } from "nanoid"
import { redisClient } from "../config/redis.mjs";

const cache_twenty_four = 60 * 60 * 24

const addUrl = async (req, res) => {
    try {
        let data = req.body

        if (!data || !data.longurl) {
            return res.status(400).send('Data is Required')
        }

        const existingUrl = await urlModel.findOne({longurl: data.longurl})
        if(existingUrl){
            return res.status(201).send({status:'Alreadt Exist', message: existingUrl})
        }
        let urlcode

        while(true){
            urlcode = nanoid(6).toLowerCase()
            const found = await urlModel.findOne({urlcode})
            if(!found) break
        }
        const shorturl = `http://localhost:8080/${urlcode}`

        data.urlcode = urlcode
        data.shorturl = shorturl
        let url = await urlModel.create(data)

        //creating on redis

        const abc = await redisClient.set(urlcode, data.longurl, {EX: cache_twenty_four})

        return res.status(201).send({ status: 'sucess', data: url, redis : abc })
    } catch (err) {
        if (err.message.includes('duplicate')) {
            return res.status(400).send({ message: "failedl", error: err.message })
        } else if (err.message.includes('validation')) {
            return res.status(400).send({ message: "failed", error: err.message })
        }
        return res.status(500).send({ message: "failed", error: err.message })
    }
}

const getUrl = async (req, res) => {
    try {
        let { urlcode } = req.params

        if (!urlcode || typeof urlcode !== 'string') {
            return res.status(400).send({ status: 'Failed', message: 'No urlCode or not string' })
        }

        let redis_data = await redisClient.get(urlcode)
        if(redis_data){
            return res.redirect(302, redis_data)
        }

        let data = await urlModel.findOne({ urlcode })

        if (!data) {
            return res.status(404).send({ status: 'Failed', message: 'No data found' })
        }

        return res.redirect(302, data.longurl)
    } catch (err) {
        if (err.message.includes('duplicate')) {
            return res.status(400).send({ message: "failedl", error: err.message })
        } else if (err.message.includes('validation')) {
            return res.status(400).send({ message: "failed", error: err.message })
        }
        return res.status(500).send({ message: "failed", error: err.message })
    }
}

export { addUrl, getUrl }