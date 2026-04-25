import express from 'express'
import { addAuthor, loginAuthor } from './controller/authorController.mjs'
import { addBlog, deleteBlog, deleteBlogByQuery, getBlog, updateBlog } from './controller/blogController.mjs'
import { authenticate, authorization } from './auth/authentication.mjs'

const router = express.Router()

router.get('/api', (req, res) => {
    res.status(200).send('working fine')
})

router.post('/authors', addAuthor)
router.post('/blogs', authenticate, addBlog)
router.get('/blogs', getBlog)
router.put('/blogs/:blogId', authenticate, authorization, updateBlog)
router.delete('/blogs/:blogId', authenticate, authorization, deleteBlog)
router.delete('/blogs', authenticate, authorization, deleteBlogByQuery)

router.post('/login', loginAuthor)
export default router