const mongoose = require("mongoose")

const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once("end", () => {
  console.log("MongoDB connection start...")
})

mongoose.connection.on("error", (err) => {
  console.error(err)
})

async function mongoConnect() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

async function mongoDisconnect(params) {
  await mongoose.disconnect()
}

module.exports = {
  mongoConnect,
  mongoDisconnect
}
