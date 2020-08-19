'use strict'

const auth = require('../middlewares/auth')
const CardController = require('../controllers/card.controller')
const validator = require('../middlewares/validator')
const express = require('express')
const router = express.Router()

router.use(auth)

router.get('/:id', CardController.findOne)
router.get('/', CardController.findAll)
router.post('/', validator, CardController.create)
router.put('/:id', validator, CardController.update)
router.delete('/:id', CardController.delete)

module.exports = router
