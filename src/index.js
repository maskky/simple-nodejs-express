'use strict'

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const route = require('./routes')
const error = require('./middlewares/error')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api/v1', route)
app.use(error)

const port = process.env.port || 3001
console.log(`Server running on port ${port}`)
app.listen(port)
