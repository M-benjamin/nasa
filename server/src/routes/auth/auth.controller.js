function googleSignIn(req, res) {
  res.send("Google")
}

function googleSignInCallBack(req, res) {
  console.log("GOOGLE BACK")
}

function signOut(req, res) {
  res.send("Google")
}

module.exports = {
  googleSignIn,
  googleSignInCallBack,
  signOut
}
