'use strict'

const assert = require('chai').assert
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()
const { mockRequest, mockResponse } = require('mock-req-res')

const CARD_MOCK = ({
  id: 1,
  name: 'test_name',
  status: true,
  content: 'test_content',
  category: 'test_category',
  author: 'test_author'
})

const dbMock = {
  cards: {
    create: sinon.stub().returns(CARD_MOCK),
    findAll: sinon.stub().returns(CARD_MOCK),
    findByPk: sinon.stub().returns(CARD_MOCK),
    update: sinon.stub().returns([1]), // Sequelize.update will return [1] if update success
    destroy: sinon.stub().returns(1) // Sequelize.destroy will return [1] if update success
  }
}
const CardController = proxyquire('../../../src/controllers/card.controller', {
  '../db': dbMock
})

describe('Test controller/card.controller', () => {
  var req, res, next, error
  beforeEach(function (done) {
    req = mockRequest()
    req.body = { mock: 'mock' } // Mock req.body to assert.deepEqual
    req.params.id = 1 // Mock req.params.id to assert.strictEqual
    res = mockResponse()
    next = sinon.stub()
    error = new Error('FAKE_ERROR')
    done()
  })

  describe('Test create card', () => {
    it('should call Card.create() with req.body', async () => {
      await CardController.create(req, res, next)
      assert.deepEqual(dbMock.cards.create.args[0][0], req.body)
    })

    it('should return with json CARD_MOCK', async () => {
      await CardController.create(req, res, next)
      assert.deepEqual(res.json.args[0][0], CARD_MOCK)
    })

    it('should return with status 201', async () => {
      await CardController.create(req, res, next)
      assert.strictEqual(res.status.args[0][0], 201)
    })

    it('should call next() with error when error', async () => {
      dbMock.cards.create = sinon.stub().throws(error)
      await CardController.create(req, res, next)
      assert.deepEqual(next.args[0][0], error)
      assert.strictEqual(next.callCount, 1)
    })
  })

  describe('Test find all card', () => {
    it('should call Card.findAll() with no parameter', async () => {
      await CardController.findAll(req, res, next)
      assert.deepEqual(dbMock.cards.findAll.args[0][0], undefined)
    })

    it('should return with json CARD_MOCK', async () => {
      await CardController.findAll(req, res, next)
      assert.deepEqual(res.json.args[0][0], CARD_MOCK)
    })

    it('should return with status 200', async () => {
      await CardController.findAll(req, res, next)
      assert.strictEqual(res.status.args[0][0], 200)
    })

    it('should call next() with error when error', async () => {
      dbMock.cards.findAll = sinon.stub().throws(error)
      await CardController.findAll(req, res, next)
      assert.deepEqual(next.args[0][0], error)
      assert.strictEqual(next.callCount, 1)
    })
  })

  describe('Test find one card', () => {
    it('should call Card.findByPk() with req.params.id', async () => {
      await CardController.findOne(req, res, next)
      assert.strictEqual(dbMock.cards.findByPk.args[0][0], req.params.id)
    })

    it('should return with json CARD_MOCK', async () => {
      await CardController.findOne(req, res, next)
      assert.deepEqual(res.json.args[0][0], CARD_MOCK)
    })

    it('should return with status 200', async () => {
      await CardController.findOne(req, res, next)
      assert.strictEqual(res.status.args[0][0], 200)
    })

    it('should call next() when throw CARD_NOT_FOUND', async () => {
      dbMock.cards.findByPk = sinon.stub().returns(null)
      await CardController.findOne(req, res, next)
      assert.strictEqual(next.args[0][0].message, 'CARD_NOT_FOUND') // Use strictEqual and Error.message because this case throw error in try so can't mock error to use deepEqual
      assert.strictEqual(next.callCount, 1)
    })

    it('should call next() with error when error', async () => {
      dbMock.cards.findByPk = sinon.stub().throws(error)
      await CardController.findOne(req, res, next)
      assert.deepEqual(next.args[0][0], error)
      assert.strictEqual(next.callCount, 1)
    })
  })

  describe('Test update card', () => {
    it('should call Card.update() with req.body and { where: { id: req.params.id } }', async () => {
      await CardController.update(req, res, next)
      assert.deepEqual(dbMock.cards.update.args[0][0], req.body)
      assert.deepEqual(dbMock.cards.update.args[0][1], { where: { id: req.params.id } })
    })

    it('should return with json CARD_MOCK', async () => {
      dbMock.cards.findByPk = sinon.stub().returns(CARD_MOCK)
      await CardController.update(req, res, next)
      assert.deepEqual(res.json.args[0][0], CARD_MOCK)
    })

    it('should return with status 200', async () => {
      await CardController.update(req, res, next)
      assert.strictEqual(res.status.args[0][0], 200)
    })

    it('should call next() when throw CARD_NOT_FOUND', async () => {
      dbMock.cards.update = sinon.stub().returns([0])
      await CardController.update(req, res, next)
      assert.strictEqual(next.args[0][0].message, 'CARD_NOT_FOUND') // Use strictEqual and Error.message because this case throw error in try so can't mock error to use deepEqual
      assert.strictEqual(next.callCount, 1)
    })

    it('should call next() with error when error', async () => {
      dbMock.cards.update = sinon.stub().throws(error)
      await CardController.update(req, res, next)
      assert.deepEqual(next.args[0][0], error)
      assert.strictEqual(next.callCount, 1)
    })
  })

  describe('Test delete card', () => {
    it('should call Card.delete() with { where: { id: req.params.id } }', async () => {
      await CardController.delete(req, res, next)
      assert.deepEqual(dbMock.cards.destroy.args[0][0], { where: { id: req.params.id } })
    })

    it('should return with status 204', async () => {
      await CardController.delete(req, res, next)
      assert.strictEqual(res.status.args[0][0], 204)
    })

    it('should call next() when throw CARD_NOT_FOUND', async () => {
      dbMock.cards.destroy = sinon.stub().returns([0])
      await CardController.delete(req, res, next)
      assert.strictEqual(next.args[0][0].message, 'CARD_NOT_FOUND') // Use strictEqual and Error.message because this case throw error in try so can't mock error to use deepEqual
      assert.strictEqual(next.callCount, 1)
    })

    it('should call next() with error when error', async () => {
      dbMock.cards.destroy = sinon.stub().throws(error)
      await CardController.delete(req, res, next)
      assert.deepEqual(next.args[0][0], error)
      assert.strictEqual(next.callCount, 1)
    })
  })
})
