import { userModel } from "../models/userModel.mjs";
import jwt from 'jsonwebtoken'
import { jwtScretKey } from "../../config.mjs";
import bcrypt from 'bcrypt'

let createUser = async (req, res) => {
    try {
        let userData = req.body
        if(!userData) {
            return res.status(400).send({ message: "please provide user details" })
        }
        userData.password = bcrypt.hashSync(userData.password, 10)
        let user = await userModel.create(userData)
        res.status(201).send({ message: "success", data: user })
    } catch (err) {
        if (err.message.includes('validation')) {
            return res.status(400).send({ message: err.message })
        } else if (err.message.includes('dublicate')) {
            return res.status(400).send({ message: err.message })
        } else {
            return res.status(500).send({ message: err.message })
        }
    }
}

let userLogin = async (req, res) => {
    try {
        let { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send({ message: "please provide email and password" })
        }

        let user = await userModel.findOne({ email: email})
        if (!user) {
            return res.status(400).send({status:"yehai hai na", message: "wrong credentials" })
        }

        let isPasswordValid = bcrypt.compareSync(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).send({ message: "wrong credentials" })
        }

        let token = jwt.sign({userId: user._id }, jwtScretKey, { expiresIn: '1h' })
        res.setHeader('Authorization', `Bearer ${token}`)

        res.status(201).send({ message: "success", data: user, token: token })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

export { createUser, userLogin }