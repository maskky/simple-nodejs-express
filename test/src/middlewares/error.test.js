'use strict'

const assert = require('chai').assert
const sinon = require('sinon')
const ErrorMiddleware = require('../../../src/middlewares/error')
const { mockRequest, mockResponse } = require('mock-req-res')

describe('Test middleware/error', () => {
  var req, res, next
  beforeEach(function (done) {
    req = mockRequest()
    res = mockResponse()
    next = sinon.stub()
    done()
  })

  function callErrorMiddlewalre (errorObject, statusCode, message) {
    ErrorMiddleware(errorObject, req, res, next)
    assert.strictEqual(res.status.args[0][0], statusCode)
    assert.deepEqual(res.json.args[0][0], message)
  }

  it('should response with BAD_REQUEST', () => {
    callErrorMiddlewalre(new Error('BAD_REQUEST'), 400, { statusCode: 400, message: 'The server could not understand the request due to invalid syntax.' })
  })

  it('should response with BODY_VALIDATE_ERROR', () => {
    callErrorMiddlewalre(new Error('BODY_VALIDATE_ERROR'), 400, { statusCode: 400, message: 'Your request body validate failed.' })
  })

  it('should response with INVALID_TOKEN', () => {
    callErrorMiddlewalre(new Error('INVALID_TOKEN'), 400, { statusCode: 400, message: 'Invalid token.' })
  })

  it('should response with UNAUTHORIZED', () => {
    callErrorMiddlewalre(new Error('UNAUTHORIZED'), 401, { statusCode: 401, message: 'Access denied. No token provided.' })
  })

  it('should response with FORBIDDEN', () => {
    callErrorMiddlewalre(new Error('FORBIDDEN'), 403, { statusCode: 403, message: 'You do not have permission.' })
  })

  it('should response with CARD_NOT_FOUND', () => {
    callErrorMiddlewalre(new Error('CARD_NOT_FOUND'), 404, { statusCode: 404, message: 'Card not found.' })
  })

  it('should response with INTERNAL_SERVER_ERROR', () => {
    callErrorMiddlewalre(new Error('INTERNAL_SERVER_ERROR'), 500, { statusCode: 500, message: 'Internal server error. Please try again later.' })
  })

  it('should response with default case', () => {
    callErrorMiddlewalre(new Error('DEFAULT'), 500, { statusCode: 500, message: 'Internal server error. Please try again later.' })
  })
})
