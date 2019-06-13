const parser = require('../index')
const expect = require('chai').expect

describe('library', function () {
  it('should return fourty four', function () {
    expect(parser()).to.be.equal(44)
  })
})
