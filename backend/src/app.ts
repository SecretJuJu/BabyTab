"use strict"

import express from "express"
import errorhandler from 'strong-error-handler'

import routes from './api/routes'

const app = express()

app.use(express.json({limit: "5mb"}))
app.use("", routes)
app.use(errorhandler({
    debug: process.env.ENV !== 'prod',
    log: true,
}));

export default app;