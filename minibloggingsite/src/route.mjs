import express from 'express'
import { addAuthor } from './controller/authorController.mjs'
import { addBlog, deleteBlog, deleteBlogByQuery, getBlog, updateBlog } from './controller/blogController.mjs'

const router = express.Router()

router.get('/api', (req, res) => {
    res.status(200).send('working fine')
})

router.post('/authors', addAuthor)
router.post('/blogs', addBlog)
router.get('/blogs', getBlog)
router.put('/blogs/:blogId', updateBlog)
router.delete('/blogs/:blogId', deleteBlog)
router.delete('/blogs', deleteBlogByQuery)
export default router