'use strict'

const assert = require('chai').assert
const sinon = require('sinon')
const jwt = require('jsonwebtoken')
const { mockRequest, mockResponse } = require('mock-req-res')
const AuthMiddleware = require('../../../src/middlewares/auth')

describe('Test middleware/auth', () => {
  var req, res, next
  beforeEach(function (done) {
    req = mockRequest()
    res = mockResponse()
    next = sinon.stub()
    process.env.auth_jwtPrivateKey = '1234'
    done()
  })

  it('should get token from req.header(x-auth-token)', () => {
    req.header = sinon.stub().returns('token')
    jwt.verify = sinon.stub()
    AuthMiddleware(req, res, next)
    assert.strictEqual(req.header.args[0][0], 'x-auth-token')
  })

  it('should call jwt.verify() with token(from req.header()) and process.env.auth_jwtPrivateKey', () => {
    jwt.verify = sinon.stub()
    req.header = sinon.stub().returns('token')
    AuthMiddleware(req, res, next)
    assert.strictEqual(jwt.verify.args[0][0], req.header())
    assert.strictEqual(jwt.verify.args[0][1], process.env.auth_jwtPrivateKey)
  })

  it('should req.user equal to value from jwt.verify()', () => {
    jwt.verify = sinon.stub().returns('decoded')
    req.header = sinon.stub().returns('token')
    AuthMiddleware(req, res, next)
    assert.strictEqual(req.user, jwt.verify())
  })

  it('should call next() wth error UNAUTHORIZED', () => {
    req.header = sinon.stub()
    AuthMiddleware(req, res, next)
    assert.strictEqual(next.args[0][0].message, 'UNAUTHORIZED')
  })

  it('should call next() with error INVALID_TOKEN', () => {
    req.header = sinon.stub().returns(true)
    jwt.verify = sinon.stub().throws('INVALID_TOKEN')
    AuthMiddleware(req, res, next)
    assert.strictEqual(next.args[0][0].message, 'INVALID_TOKEN')
  })

  it('should call next()', () => {
    req.header = sinon.stub().returns(true)
    jwt.verify = sinon.stub()
    AuthMiddleware(req, res, next)
    assert.strictEqual(next.args[0][0], undefined)
    assert.strictEqual(next.callCount, 1)
  })
})
