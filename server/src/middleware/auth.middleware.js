function checkLoggin(req, res, next) {
  console.log("CURRENT USER::", req.user)

  const isLoggedIn = req.isAuthentification() && req.user

  if (!isLoggedIn) {
    return res.status(401).json({
      error: "You must loggin"
    })
  }
  next()
}

module.exports = {
  checkLoggin
}
