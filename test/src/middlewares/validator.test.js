'use strict'

const assert = require('chai').assert
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

describe('Test middleware/validator', () => {
  var req, res, next, joiMock, ValidatorMiddleware
  before(() => {
    req = function () {}
    req.body = sinon.stub().returns({ mock: 'MOCK_BODY' })
    res = sinon.stub()
    next = sinon.stub()
    joiMock = {
      string: sinon.stub().returnsThis(),
      alphanum: sinon.stub().returnsThis(),
      lowercase: sinon.stub().returnsThis(),
      required: sinon.stub().returnsThis(),
      boolean: sinon.stub().returnsThis(),
      object: sinon.stub().returnsThis(),
      validate: sinon.stub().returnsThis()
    }

    ValidatorMiddleware = proxyquire('../../../src/middlewares/validator', {
      joi: joiMock
    })
  })

  it('should call next() once with no parameter', () => {
    joiMock.validate = sinon.stub().returns(false)
    ValidatorMiddleware(req, res, next)
    assert.strictEqual(next.callCount, 1)
    assert.strictEqual(next.args[0][0], undefined)
  })

  it('should call schema.validate() once with req.body', () => {
    joiMock.validate = sinon.stub().returns(false)
    ValidatorMiddleware(req, res, next)
    assert.strictEqual(joiMock.validate.callCount, 1)
    assert.deepEqual(joiMock.validate.args[0][0], req.body)
  })

  it('should call next() with error BODY_VALIDATE_ERROR', () => {
    next = sinon.stub()
    joiMock.validate = sinon.stub().returns({ error: 'FAKE_ERROR' })
    ValidatorMiddleware(req, res, next)
    assert.strictEqual(next.args[0][0].message, 'BODY_VALIDATE_ERROR')
  })
})
