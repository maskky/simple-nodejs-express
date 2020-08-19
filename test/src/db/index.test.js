'use strict'

const assert = require('chai').assert
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

describe('Test db/index', () => {
  let initDB
  let dbMock
  let sequelize = {}
  let Sequelize = {}
  const SequelizeClass = {}
  before(() => {
    process.exit = sinon.stub()
    console.log = sinon.stub()

    process.env = {
      db_user: 'db_user',
      db_host: 'db_host',
      db_database: 'db_database',
      db_password: 'db_password',
      db_port: 'db_port'
    }

    sequelize = {
      authenticate: sinon.stub(),
      define: sinon.stub(),
      sync: sinon.stub()
    }
    Sequelize = sinon.stub(SequelizeClass, 'constructor').returns(sequelize)

    initDB = () => {
      dbMock = proxyquire('../../../src/db', {
        sequelize: Sequelize,
        './card.model.js': sinon.stub().returns('CARD_MOCK')
      })
    }
  })

  describe('Test Success', () => {
    before(() => {
      sequelize.authenticate = sinon.stub().resolves()
      initDB()
    })

    it('should exported db have method Sequelize, sequelize, cards and similar to this mock', () => {
      assert.deepEqual(dbMock.Sequelize, Sequelize)
      assert.deepEqual(dbMock.sequelize, sequelize)
      assert.strictEqual(dbMock.cards, 'CARD_MOCK')
    })

    it('should initial database correctly', () => {
      assert.strictEqual(Sequelize.args[0][0], `postgres://${process.env.db_user}:${process.env.db_password}@${process.env.db_host}:${process.env.db_port}/${process.env.db_database}`)
    })

    it('should initial database with logging false', () => {
      assert.deepEqual(Sequelize.args[0][1], { logging: false })
    })

    it('should call \'then\' after sequelize.authenticate()', () => {
      assert.strictEqual(console.log.args[0][0], 'Successfully connected to database.')
    })

    it('should call sequelize.sync()', () => {
      assert.strictEqual(sequelize.sync.callCount, 1)
    })
  })

  describe('Test Failure', () => {
    let MOCK_ERROR
    before(() => {
      console.log = sinon.stub()
      MOCK_ERROR = new Error('MOCK_ERROR')
      sequelize.authenticate = sinon.stub().rejects(MOCK_ERROR)
      initDB()
    })

    it('should call console.log() with string and error', () => {
      assert.strictEqual(console.log.args[0][0], 'Unable to connect to the database:')
      assert.deepEqual(console.log.args[0][1], MOCK_ERROR)
    })

    it('should call \'catch\' after sequelize.authenticate()', () => {
      assert.strictEqual(process.exit.callCount, 1)
      assert.strictEqual(process.exit.args[0][0], 1)
    })
  })
})
