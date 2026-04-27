import jwt from 'jsonwebtoken'
import { jwtScretKey } from "../../config.mjs";
import { bookModel } from '../models/bookModel.mjs'
const authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) {
            return res.status(400).send({ message: "please provide token" })
        }
        token = token.split(" ")[1]
        //console.log(token)
        jwt.verify(token, jwtScretKey, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "invalid token" })
            }
            req.user = decoded
            //console.log(decoded)
            next()
        })

    } catch (error) {
        return res.status(500).send({ message: 'Authentication failed', error: error.message })
    }
}

const authorisation = async (req, res, next) => {
    try {
        let userId = req.user.userId
        console.log(userId)
        let bookId = req.params.bookId
        if (!bookId) {
            return res.status(400).send({ message: "please provide bookId" })
        }
        if (!userId) {
            return res.status(400).send({ message: "please provide userId" })
        }
        let book = await bookModel.findById(bookId)
        if (!book || book.isDeleted == true) {
            return res.status(400).send({ message: "no book is present" })
        }
        if (book.userId.toString() !== userId) {
            return res.status(403).send({ message: "you are not authorised to perform this action" })
        }
        next()

    } catch (error) {
        return res.status(500).send({ message: 'Authorisation failed', error: error.message })
    }
}

export { authentication, authorisation }