'use strict'

const assert = require('chai').assert
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const useMock = sinon.stub()
const listenMock = sinon.stub()
const expressMock = () => ({
  use: useMock,
  listen: listenMock
})

const urlencodedMock = sinon.stub().returns('URLENCODED_MOCK')
const jsonMock = sinon.stub().returns('JSON_MOCK')
const bodyParserMock = ({
  urlencoded: urlencodedMock,
  json: jsonMock
})
const routeMock = sinon.stub()
const errorMiddlewareMock = sinon.stub()

proxyquire('../../src/index', {
  express: expressMock,
  'body-parser': bodyParserMock,
  './routes': routeMock,
  './middlewares/error': errorMiddlewareMock
})

describe('Test index.js', () => {
  it('should call app.use() \'bodyParser.urlencoded({ extended: true })\'', () => {
    assert.deepEqual(urlencodedMock.args[0][0], { extended: true })
    assert.strictEqual(useMock.args[0][0], 'URLENCODED_MOCK')
  })

  it('should call app.use() \'bodyParser.json()\'', () => {
    assert.strictEqual(useMock.args[1][0], 'JSON_MOCK')
  })

  it('should call app.use() \'/api/v1\' and route', () => {
    assert.strictEqual(useMock.args[2][0], '/api/v1')
    assert.deepEqual(useMock.args[2][1], routeMock)
  })

  it('should call app.use() \'error\' lastest', () => {
    assert.deepEqual(useMock.args[useMock.args.length - 1][0], errorMiddlewareMock)
  })

  it('should call app.listen() \'port\' and function', () => {
    assert.strictEqual(typeof (listenMock.args[0][0]), 'number')
  })
})
