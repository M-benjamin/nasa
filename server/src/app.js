const express = require("express")
const path = require("path")
const app = express()
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")
const passport = require("passport")
const cookieSession = require("cookie-session")
const { Strategy } = require("passport-google-oauth20")
const api = require("./routes/api")

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2
}

const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET
}

function verifyCallBack(accessToken, refreshToken, profile, done) {
  console.log("GOOGLE PROFILE", profile)
  done(null, profile)
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallBack))

// > Save the session to cookie
passport.serializeUser((user, done) => {
  done(null, user)
})

// > Get from cookie
passport.deserializeUser((obj, done) => {
  done(null, obj)
})

app.use(express.json())

// > For security
app.use(helmet())
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2]
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use(
  cors({
    origin: "http://localhost:3000"
  })
)
// > For Logs */
app.use(morgan("combined"))
app.use(express.static(path.join(__dirname, "..", "public")))

app.use("/v1", api)

// > All route redirect to _> index.html
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})

module.exports = app
