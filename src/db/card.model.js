'use strict'

module.exports = (sequelize, Sequelize) => {
  return sequelize.define('card', {
    name: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.BOOLEAN
    },
    content: {
      type: Sequelize.STRING
    },
    category: {
      type: Sequelize.STRING
    },
    author: {
      type: Sequelize.STRING
    }
  })
}
