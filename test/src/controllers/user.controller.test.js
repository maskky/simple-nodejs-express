'use strict'

const assert = require('chai').assert
const sinon = require('sinon')
const jwt = require('jsonwebtoken')
const { mockRequest, mockResponse } = require('mock-req-res')
const UserController = require('../../../src/controllers/user.controller')
const TOKEN_MOCK = 'TEST-TOKEN'

describe('Test controller/user.controller', () => {
  var req, res, next, error
  beforeEach(function (done) {
    req = mockRequest()
    req.body.username = 'test_user'
    res = mockResponse()
    next = sinon.stub()
    error = new Error('FAKE_ERROR')
    jwt.sign = sinon.stub().returns(TOKEN_MOCK)
    process.env.auth_jwtPrivateKey = '1234' // Mock jwt private key
    done()
  })

  it('should send token', async () => {
    await UserController.login(req, res, next)
    assert(res.send.calledWith(TOKEN_MOCK))
  })

  it('should call next() when error BODY_VALIDATE_ERROR', async () => {
    req.body.username = null
    await UserController.login(req, res, next)
    assert.strictEqual(next.args[0][0].message, 'BODY_VALIDATE_ERROR') // Use strictEqual and Error.message because this case throw error in try so can't mock error to use deepEqual
    assert.strictEqual(next.callCount, 1)
  })

  it('should call jwt.sign() once with object and jwtPrivatekey', async () => {
    await UserController.login(req, res, next)
    assert.strictEqual(jwt.sign.callCount, 1)
    assert.deepEqual(jwt.sign.args[0][0], { author: req.body.username })
    assert.strictEqual(jwt.sign.args[0][1], process.env.auth_jwtPrivateKey)
  })

  it('should call next() with error when error', async () => {
    jwt.sign = sinon.stub().throws(error)
    await UserController.login(req, res, next)
    assert.deepEqual(next.args[0][0], error)
    assert.strictEqual(next.callCount, 1)
  })
})
