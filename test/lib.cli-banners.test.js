const {assign} = Object;
const sinon = require('sinon')
const sut = require('../lib/cli-banners')

module.exports = 
{ 'lib/cli-banners': 
  { 'should be a factory function that expects one argument - a logger instance': 
    () => Should(sut).be.a.Function().property('length', 1)
  , 'when used with a logger instance': 
    { 'should return a banner instance': 
      () => {
          const log = mockLog()
          const instance = sut(log)
          Should(instance).be.an.Object()
      }
    }
  , '~banners': block(() => {
        const log = mockLog()
        let banners;
        return {
          beforeAll: () => banners = sut(log)
        , '.hello()' :
          bannerSuite({api: 'hello', args: 0, msg: /Open API Server Mocker/})
        , '.up(address)':
          bannerSuite({api: 'up', args: 1, msg: /server started/})
        , 'bye(sig)':
          bannerSuite({api: 'bye', args: 1, msg: /Accepted signal/})
        , 'error(err)':
          bannerSuite({api: 'error', args: 1, msg: /oupsy/, level: 'error', arg: new Error('oupsy') })
        , 'fatal(err)':
          bannerSuite({api: 'fatal', args: 1, msg: /fatal error/, level: 'fatal', arg: new Error('fatal error') })
        }

        function bannerSuite({api, args, msg, level = 'info', arg = 'foo'}) {
            return { beforeAll: () => log.reset() && banners[api](arg)
                  , 'should be a method that expects an address descriptor': 
                    () => Should(banners[api]).be.a.Function().property('length',args)
                  , 'when called - should emit server-up banner as info':
                    () => Should(log[level].called).be.True() 
                       && Should(log[level].getCall(0).args[0]).match(msg)
                  }
        }
    })
  }
}


function mockLog() {
    const reset = () => assign(log
    , { debug: sinon.spy()
      , info:  sinon.spy()
      , warn:  sinon.spy()
      , error: sinon.spy()
      , fatal: sinon.spy()
      }
    )
    const log = {reset}
    return log.reset()
}