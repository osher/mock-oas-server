const sway = require('sway')
const sut = require('../lib/model/gen-mgr')
var oasApi;

module.exports = 
{ 'lib/model/gen-mgr' :
  { beforeAll: 
    () => sway
      .create({ definition: './test/fixtures/petstore.oas.yaml' })
      .then(api => oasApi = api)
  , 'should be a synchronous factory function that expects one argument - options' :
    () => Should(sut)
      .be.a.Function()
      .have.property('length', 1)
  , 'when called with ioc bag' :
    { 'should return an initiated instance of cam-mgr model with 1 api: response(..)' :
      () => {
          const mgr = sut({sway:oasApi})
          Should(mgr).be.an.Object()
            .have.property('response')
            .be.a.Function()
            .have.property('length',1)
      }
    }
  , 'an well initiated mgr' : 
    block(() => {
        let mgr
        let res
        return {
          beforeAll: () => mgr = sut({sway:oasApi})
        , '.response(key)':
          { 'when called with a key that represents a swagger operatio' :
            { 'and the operation does not define a success reply' : 'TBD'
            , 'and the operation defines a success reply' :
              { beforeAll: () => res = mgr.response({ url: '/v2/pet/1234', method: 'GET'})
              , 'the returned response': 
                { 'should have numeric .status' : 
                  () => Should(res).have.property('status') 
                     && Should(res.status * 1).be.Number().not.be.NaN()
                , 'should have string .type' : () => Should(res).have.property('type').String()
                , 'should have object .headers' : () => Should(res).have.property('headers').Object()
                , 'should have .body' : () => Should(res).have.property('body')
                }
              }
            }
          , 'when called wiht a key that does not represent a swagger operation' :
            { beforeAll: () => res = mgr.response({ url: 'no-such-path', method: 'GET' })
            , 'should return null' : () => Should(res).be.Null()
            }
          }
        }
    })
  }
}