const express = require("express")
const passport = require("passport")
const { checkLoggin } = require("../../middleware/auth.middleware")
const {
  googleSignIn,
  signOut,
  googleSignInCallBack
} = require("./auth.controller")

const authRouter = express.Router()

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email"],
    session: false
  }),
  googleSignIn
)
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/",
    session: false
  }),
  googleSignInCallBack
)

authRouter.get("/secret", checkLoggin, (req, res) => {
  res.send("SECRET PAGE")
})

authRouter.get("/logout", checkLoggin, (req, res) => {
  req.logout()
  return res.redirect("/")
})

authRouter.get("/logout", signOut)

module.exports = authRouter
