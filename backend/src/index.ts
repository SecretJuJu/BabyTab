'use strict'

import app from './app'


const PORT = process.env.PORT || 3000;
let initCallback

app.listen ( PORT , async () => {
    console.log(initCallback)
    console.info(`Server running on port ${PORT}`)
    app.emit("appStarted");
})