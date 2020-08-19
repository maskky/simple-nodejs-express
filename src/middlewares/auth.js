'use strict'

const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  try {
    const token = req.header('x-auth-token')
    if (!token) return next(new Error('UNAUTHORIZED'))
    const decoded = jwt.verify(token, process.env.auth_jwtPrivateKey)
    req.user = decoded
    next()
  } catch (err) {
    next(new Error('INVALID_TOKEN'))
  }
}
