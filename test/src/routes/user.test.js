'use strict'

const assert = require('chai').assert
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const controllerMock = {
  login: sinon.stub()
}
const postRouterMock = sinon.stub()
const expressMock = {
  Router: () => ({
    post: postRouterMock
  })
}
proxyquire('../../../src/routes/user', {
  '../controllers/user.controller': controllerMock,
  express: expressMock
})

describe('Test route/user', () => {
  it('should call router.post with \':/\' and UserController.login', () => {
    assert.equal(postRouterMock.args[0][0], '/login')
    assert.deepEqual(postRouterMock.args[0][1], controllerMock.login)
  })
})
