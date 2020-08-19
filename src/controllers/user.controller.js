'use strict'

const jwt = require('jsonwebtoken')

exports.login = async (req, res, next) => {
  try {
    if (!req.body.username) {
      return next(new Error('BODY_VALIDATE_ERROR'))
    }
    const token = jwt.sign({ author: req.body.username }, process.env.auth_jwtPrivateKey)
    return res.send(token)
  } catch (e) {
    next(e)
  }
}
