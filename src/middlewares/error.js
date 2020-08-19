'use strict'

const ERROR_MESSAGE = {
  BAD_REQUEST: {
    statusCode: 400,
    message: 'The server could not understand the request due to invalid syntax.'
  },
  BODY_VALIDATE_ERROR: {
    statusCode: 400,
    message: 'Your request body validate failed.'
  },
  INVALID_TOKEN: {
    statusCode: 400,
    message: 'Invalid token.'
  },
  UNAUTHORIZED: {
    statusCode: 401,
    message: 'Access denied. No token provided.'
  },
  FORBIDDEN: {
    statusCode: 403,
    message: 'You do not have permission.'
  },
  CARD_NOT_FOUND: {
    statusCode: 404,
    message: 'Card not found.'
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    message: 'Internal server error. Please try again later.'
  }
}

module.exports = function (err, req, res, next) {
  if (!Object.keys(ERROR_MESSAGE).includes(err.message)) {
    return res.status(500).json({ statusCode: 500, message: 'Internal server error. Please try again later.' })
  }

  const { statusCode, message } = ERROR_MESSAGE[err.message]
  return res.status(statusCode).json({ statusCode: statusCode, message: message })
}
