'use strict'

const db = require('../db')
const Card = db.cards
// const Op = db.Sequelize.Op

exports.create = async (req, res, next) => {
  try {
    const data = await Card.create(req.body)
    return res.status(201).json(data)
  } catch (e) {
    next(e)
  }
}

exports.findAll = async (req, res, next) => {
  try {
    const data = await Card.findAll()
    return res.status(200).json(data)
  } catch (e) {
    next(e)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    const data = await Card.findByPk(req.params.id)
    if (!data) return next(new Error('CARD_NOT_FOUND'))
    return res.status(200).json(data)
  } catch (e) {
    next(e)
  }
}

exports.update = async (req, res, next) => {
  try {
    const data = await Card.update(req.body, { where: { id: req.params.id } })
    if (data[0] !== 1) return next(new Error('CARD_NOT_FOUND'))
    const updatedData = await Card.findByPk(req.params.id)
    return res.status(200).json(updatedData)
  } catch (e) {
    next(e)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const data = await Card.destroy({ where: { id: req.params.id } })
    if (data !== 1) return next(new Error('CARD_NOT_FOUND'))
    return res.status(204).json()
  } catch (e) {
    next(e)
  }
}
