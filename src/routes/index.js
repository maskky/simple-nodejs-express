'use strict'

const express = require('express')
const card = require('./card')
const user = require('./user')
const router = express.Router()

router.use('/card', card)
router.use('/user', user)

module.exports = router
