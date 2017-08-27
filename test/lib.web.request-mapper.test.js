const assign = Object.assign
const sut = require('../lib/web/request-mapper.js')
const baseRequest = 
  { httpVersion: '1.1'
  , method: 'POST'
  , url: '/foo/bar?q=1'
  , originalUrl: '/v1/foo/bar?q=1'
  , baseUrl: '/v1'
  , headers:
    { 'accept' : '*/*'
    , 'content-type': 'application/json'
    }
  , params:
    { foo: 'foo'
    , bar: 'bar'
    }
  , query:
    { q: 1
    }
  , body:
    { aha: 'aha'
    , zoo: 'gar'
    }
  }
var mapped

module.exports =
{ 'lib/web/request-mapper.js' : 
  { 'should be a mapper function that names one arg - request' :
    () => Should(sut)
      .be.a.Function()
      .have.property('length', 1)
  , 'when called with a swagger-request' : 
    { before: () => mapped = sut( assign({}, baseRequest, 
      { swagger:
        { params:
          { foo: { value: 'foo' }
          , bar: { value: 'bar' }
          , q:   { value: 1     }
          }
        }
      }) )
    , 'it should map swagger params' :
      () => Should(mapped).have.property('oasParams', { foo: 'foo', bar: 'bar', q: 1 })
    }
  , 'when called with a non-swagger-request' : 
    { before: () => mapped = sut(assign({}, baseRequest))
    , 'it should map the request without oasParams' :
      () => Should(mapped).eql(
        assign({}, baseRequest, {oasParams: undefined })
      )
    }
  }
}