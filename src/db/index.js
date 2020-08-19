'use strict'

const user = process.env.db_user
const host = process.env.db_host
const database = process.env.db_database
const password = process.env.db_password
const port = process.env.db_port

const Sequelize = require('sequelize')
const sequelize = new Sequelize(`postgres://${user}:${password}@${host}:${port}/${database}`, {
  logging: false
})

sequelize.authenticate()
  .then(() => {
    console.log('Successfully connected to database.')
  })
  .catch(err => {
    console.log('Unable to connect to the database:', err)
    process.exit(1)
  })

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.cards = require('./card.model.js')(sequelize, Sequelize)

db.sequelize.sync()
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.")
// })

module.exports = db
