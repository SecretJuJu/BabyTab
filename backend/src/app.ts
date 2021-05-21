"use strict"

import express from "express"
import errorhandler from 'strong-error-handler'
import bodyParser from "body-parser"
import passport from "passport"
import passportSetup from "./config/passport-setup"
import routes from './app/routes'

const app = express()

passportSetup()

app.use(express.json({limit: "5mb"}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use("", routes)
app.use(passport.initialize())
app.use(errorhandler({
    debug: process.env.ENV !== 'prod',
    log: true,
}));

export default app;