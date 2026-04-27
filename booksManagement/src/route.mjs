import express from 'express'
import { createUser, userLogin } from './controller/userController.mjs'
import { createBook, getallBooks, getBookById, updateBook, deleteBookById } from './controller/bookController.mjs'
import { addReview, updateReview, deleteReviewById } from './controller/reviewController.mjs'
import {authentication, authorisation} from './auth/authentication.mjs'

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World Two')
})

router.post('/createuser', createUser)
router.post('/createbook', createBook)

router.post('/login', userLogin)

router.get('/books', authentication, getallBooks)
router.get('/books/:bookId', authentication, authorisation, getBookById)
router.put('/books/:bookId', authentication, authorisation, updateBook)
router.delete('/books/:bookId', authentication, authorisation, deleteBookById)

router.post('/books/:bookId/review', authentication, authorisation, addReview)
router.put('/books/:bookId/review/:reviewId', authentication, authorisation, updateReview)
router.delete('/books/:bookId/review/:reviewId', authentication, authorisation, deleteReviewById)

export default router