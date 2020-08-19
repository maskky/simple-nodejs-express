'use strict'

const assert = require('chai').assert
const sinon = require('sinon')

describe('Test db/card.model', () => {
  let sequelizeMock
  let SequelizeMock
  let cardMock

  before(() => {
    sequelizeMock = {
      define: sinon.stub()
    }
    SequelizeMock = {
      STRING: 'string',
      BOOLEAN: 'boolean'
    }
    cardMock = {
      name: { type: 'string' },
      status: { type: 'boolean' },
      content: { type: 'string' },
      category: { type: 'string' },
      author: { type: 'string' }
    }
    require('../../../src/db/card.model')(sequelizeMock, SequelizeMock)
  })

  it('should call sequelize.define() with \'card\'', () => {
    assert.deepEqual(sequelizeMock.define.args[0][0], 'card')
  })

  it('should call sequelize.define() with \'card object\'', () => {
    assert.deepEqual(sequelizeMock.define.args[0][1], cardMock)
  })
})
