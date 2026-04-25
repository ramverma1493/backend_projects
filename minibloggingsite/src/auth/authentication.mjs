import jwt from 'jsonwebtoken'
import { SecretKey } from '../../config.mjs'
import { blogModel } from '../models/blogModel.mjs'

const authenticate = (req, res, next) => {
    try {
        let token = req.headers['authorization']
        if (!token) {
            return res.status(401).send({ message: 'Authorization token is required' })
        }
        token = token.split(' ')[1]
        jwt.verify(token, SecretKey, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: 'Invalid or expired token' })
            }
            req.user = decoded
            next()
        })
    } catch (err) {
        return res.status(500).send({ message: 'Failed to authenticate', error: err.message })
    }
}

let authorization = async (req, res, next) => {
    try{
        let blogId = req.params.blogId
        let data = await blogModel.findById(blogId)
        if(!data){
            return res.status(404).send({ message: 'Blog not found' })
        }
        let authorId = data.authorId.toString()
        if (!authorId) {
            return res.status(400).send({ message: 'Author ID is required for authorization' })
        }
        if (req.user.authorId !== authorId) {
            return res.status(403).send({ message: 'You are not authorized to perform this action' })
        }  
        //res.send({ message: 'Authorization successful', data: req.user })   
        next()
    }catch(err){
        return res.status(500).send({ message: 'Failed to authorize', error: err.message })
    }
}

export { authenticate, authorization }