import express from 'express'
import { addUrl, getUrl } from './controller/urlController.mjs'

const router = express.Router()

router.get('/api', (req, res) => {
    res.status(200).send('working fine')
})

router.post('/url/shorten', addUrl)
router.get('/:urlcode', getUrl)

export default router