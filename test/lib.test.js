const sut = require('../')

module.exports = 
{ 'oas-mocker': 
  { 'should be a factory function that names 1 arguments - ctx':
      () => Should(sut).be.a.Function().have.property('length', 1)
  , 'when provided with a valid context with logger and args': 
    { 'should return an EventEmitter': null
    , 
    }
  }
}