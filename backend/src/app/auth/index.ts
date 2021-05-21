import express from 'express'
import config from '../../config/config'
import passport from 'passport'

const router = express.Router()

router.post("/login", (req: express.Request, res: express.Response) => {
    res.send(config)
})
router.get("/google",
    passport.authenticate('google', {
        session: false,
        scope: ["profile", "email"],
        accessType: "offline"
    })
)

router.get("/google/callback",
    passport.authenticate('google', { session: false }),
    (req, res) => {
        console.log()
        res.send("thanks for login")
    }
)

router.get("/failed",(req: express.Request, res: express.Response) => {
    res.send("login failed")
})

export default router