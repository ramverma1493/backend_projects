import { authorModel } from '../models/authorModel.mjs'

let addAuthor = async (req, res) => {
    try {
        let data = req.body
        if (!data) {
            return res.status(400).send({ staus: 'false', message: 'data is required' })
        }
        let author = (await authorModel.create(data)).populate('authorId')
        return res.status(201).send({ message: 'success', data: author })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send({ message: "Email already exists" })
        }
        if (err.message.includes('dublicate')) {
            return res.status(400).send({ message: "failed", error: err.message })
        } else if (err.message.includes('validation')) {
            return res.status(400).send({ message: "failed", error: err.message })
        }
        return res.status(500).send({ message: "failed", error: err.message })
    }
}

export { addAuthor }