import express from 'express'
import config from '../config/config'

const router = express.Router()

router.post("/login", (req: express.Request, res: express.Response) => {
    res.send(config)
})

export default router