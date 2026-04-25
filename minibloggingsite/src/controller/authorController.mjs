import { authorModel } from '../models/authorModel.mjs'
import jwt from 'jsonwebtoken'
import { SecretKey} from '../../config.mjs'

const addAuthor = async (req, res) => {
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

const loginAuthor = async (req, res) => {
    try{
        let {email, password} = req.body
        if(!email || !password){
            return res.status(400).send({message: 'email and password are required'})
        }
        let author = await authorModel.findOne({email, password}).select('-password')
        if(!author){
            return res.status(401).send({message: 'Invalid email or password'})
        }
        let token = jwt.sign({authorId: author._id, email: author.email}, 
            SecretKey, {expiresIn: '1h'})
        if(!token){
            return res.status(500).send({message: 'Failed to generate token'})
        }

        res.setHeader('Authorization', `Bearer ${token}`)
        return res.status(200).send({message: 'Login successful', author:author, token })
    }catch(err){
        return res.status(500).send({message: 'Failed to login', error: err.message})   
    }
}

export { addAuthor, loginAuthor }