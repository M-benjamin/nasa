const express = require("express")
const {
  httpGetAllLaunches,
  httpAddNewLaunches,
  httpAbordLaunch
} = require("./launches.controller")

const launchesRouter = express.Router()

launchesRouter.get("/", httpGetAllLaunches)
launchesRouter.post("/", httpAddNewLaunches)
launchesRouter.delete("/:id", httpAbordLaunch)

module.exports = launchesRouter
