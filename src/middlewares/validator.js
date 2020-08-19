'use strict'

const Joi = require('joi')

module.exports = function (req, res, next) {
  const schema = Joi.object({
    name: Joi.string().alphanum().lowercase().required(),
    status: Joi.boolean().required(),
    content: Joi.string().alphanum().required(),
    category: Joi.string().alphanum().required(),
    author: Joi.string().lowercase().required()
  })

  const { error } = schema.validate(req.body)
  return error ? next(new Error('BODY_VALIDATE_ERROR')) : next()
}
