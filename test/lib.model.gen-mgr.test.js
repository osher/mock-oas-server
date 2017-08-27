const sut = require('../lib/model/gen-mgr')

module.exports = 
{ 'lib/model/gen-mgr' :
  { 'should be a factory function that expects one argument - options' :
    () => Should(sut)
      .be.a.Function()
      .have.property('length', 1)
  }
}