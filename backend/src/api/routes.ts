import express from 'express'

const router = express.Router()

router.get("/",(req: express.Request, res: express.Response) => {
    console.log("dsadasdihagfiuyasgfidaho")
    res.send("helloworld")
})

export default router