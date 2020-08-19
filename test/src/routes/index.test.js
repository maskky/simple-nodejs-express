'use strict'

const assert = require('chai').assert
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const cardRouteMock = sinon.stub()
const userRouteMock = sinon.stub()
const useRouterMock = sinon.stub()
const expressMock = {
  Router: () => ({
    use: useRouterMock
  })
}

proxyquire('../../../src/routes', {
  express: expressMock,
  './card': cardRouteMock,
  './user': userRouteMock
})

describe('Test route/index', () => {
  it('should call router.use with \'/card\' and card router', () => {
    assert.equal(useRouterMock.args[0][0], '/card')
    assert.deepEqual(useRouterMock.args[0][1], cardRouteMock)
  })

  it('should call router.use with \'/user\' and user router', () => {
    assert.equal(useRouterMock.args[1][0], '/user')
    assert.deepEqual(useRouterMock.args[1][1], userRouteMock)
  })
})
