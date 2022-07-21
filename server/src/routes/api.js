const express = require("express")

// > Import Router */
const planetsRouter = require("../routes/planets/planets.router")
const launchesRouter = require("../routes/launches/launches.router")
const authRouter = require("../routes/auth/auth.router")

const api = express.Router()

api.use("/auth", authRouter)
api.use("/planets", planetsRouter)
api.use("/launches", launchesRouter)

module.exports = api
