'use strict'

const UserController = require('../controllers/user.controller')
const express = require('express')
const router = express.Router()

router.post('/login', UserController.login)

module.exports = router
