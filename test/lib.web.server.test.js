const args = require('../lib/args')
const sut = require('../lib/web/server')

module.exports = 
{ 'lib/web/server': 
  { 'should be a factory function that expects 1 argument' :
    () => Should(sut)
      .be.a.Function()
      .have.property('length')
  , 'should return a promise': 
    () => 
      sut({args:{}}).catch(() => null)
  , 'when provided with valid context with arguments and logger' : block(() => {
        let app
        return {
          before: () => sut(
            { args: 
              args(
                { argv: ['/path/to/node', '/path/to/cli', '-s', 'test/fixtures/petstore.oas.yaml'] }
              , { log: (msg) => {} }
              )
            }
          ).then( a => app = a )
        , 'should return an express application':
          () => Should(app)
            .have.properties("listen", "set", "on", "use", "all", "get", "put", "post")
        }
    })
  }
}
