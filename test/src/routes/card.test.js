'use strict'

const assert = require('chai').assert
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const authMock = sinon.stub()
const validatorMock = sinon.stub()
const controllerMock = {
  findOne: sinon.stub(),
  findAll: sinon.stub(),
  create: sinon.stub(),
  update: sinon.stub(),
  delete: sinon.stub()
}
const getRouterMock = sinon.stub()
const useRouterMock = sinon.stub()
const postRouterMock = sinon.stub()
const putRouterMock = sinon.stub()
const deleteRouterMock = sinon.stub()
const expressMock = {
  Router: () => ({
    get: getRouterMock,
    post: postRouterMock,
    put: putRouterMock,
    delete: deleteRouterMock,
    use: useRouterMock
  })
}
proxyquire('../../../src/routes/card', {
  '../middlewares/auth': authMock,
  '../middlewares/validator': validatorMock,
  '../controllers/card.controller': controllerMock,
  express: expressMock
})

describe('Test route/card', () => {
  it('should call router.get with \':/id\' and CardController.findOne', () => {
    assert.equal(getRouterMock.args[0][0], '/:id')
    assert.deepEqual(getRouterMock.args[0][1], controllerMock.findOne)
  })

  it('should call router.get with \':/\' and CardController.findAll', () => {
    assert.equal(getRouterMock.args[1][0], '/')
    assert.deepEqual(getRouterMock.args[1][1], controllerMock.findAll)
  })

  it('should call router.post with \':/\' and validator then call CardController.create', () => {
    assert.equal(postRouterMock.args[0][0], '/')
    assert.deepEqual(postRouterMock.args[0][1], validatorMock)
    assert.deepEqual(postRouterMock.args[0][2], controllerMock.create)
  })

  it('should call router.put with \'/:id\' and validator then call CardController.update', () => {
    assert.equal(putRouterMock.args[0][0], '/:id')
    assert.deepEqual(putRouterMock.args[0][1], validatorMock)
    assert.deepEqual(putRouterMock.args[0][2], controllerMock.update)
  })

  it('should call router.delete with \'/:id\' and CardController.delete', () => {
    assert.equal(deleteRouterMock.args[0][0], '/:id')
    assert.deepEqual(deleteRouterMock.args[0][1], controllerMock.delete)
  })
})
