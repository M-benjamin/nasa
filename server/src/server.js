const fs = require("fs")
const http = require("http")
const https = require("https")
const path = require("path")
require("dotenv").config()
const PORT = process.env.PORT || 8000

const app = require("./app")
const { loadLauncheData } = require("./models/launches/launches.model")
const { loadPlanetsData } = require("./models/planets/planets.model")
const { mongoConnect } = require("./services/mongo")

const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem"))
  },
  app
)

async function startServer() {
  await mongoConnect()
  await loadPlanetsData()
  await loadLauncheData()

  server.listen(PORT, () => {
    console.log(`LISTEN ON PORT ${PORT}`)
  })
}

startServer()
