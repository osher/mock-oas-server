var fs    = require('fs')
  , path  = require('path')
  , args  = require('../lib/args')
  ;
module.exports = 
{ 'lib/args' : 
  { '.spec' : 
    { 'should correspond to switch -s' :
      function() {
          var value = 'TEST' + Math.random()
            , args = runWith(['-s', value])
            ;
          args.should.have.property('spec',value)
          args.should.have.property('s',value)
          runWith.exit.should.be.False()
      }
    , 'should correspond to switch --spec' :
      function() {
          var value = 'TEST' + Math.random()
            , args = runWith(['--spec', value])
            ;
          args.should.have.property('spec',value)
          args.should.have.property('s',value)
          runWith.exit.should.be.False()
      }
    , 'should be a mandatory argument' :
      function() {
          var value = process.cwd()
            , args = runWith([])
            ;
          runWith.exit.should.be.True()
          runWith.logged.length.should.be.greaterThan(0)
      }
    }
  , '.port':      optionalSwitchTest(
      { shortKey: 'p'
      , longKey:  'port'
      , value:    parseInt( Math.random() * 10000) 
      , dflt:     3000
      }
    )
  , '.hostname':  optionalSwitchTest(
      { shortKey: 'n'
      , longKey:  'hostname'
      , value:    'TEST' + Math.random() 
      , dflt:     'localhost'
      }
    )
  , '.managementPath': optionalSwitchTest(
      { shortKey: 'm'
      , longKey:  'management-path'
      , value:    '/manage/' + Math.random() 
      , dflt:     '/oas'
      }
    )
  , '.shutdownGrace': optionalSwitchTest(
      { shortKey: 'g'
      , longKey:  'shutdown-grace'
      , value:    parseInt( Math.random() * 10000) 
      , dflt:     1500
      }
    )
  , '.logLevel':  optionalSwitchTest(
      { shortKey: 'l'
      , longKey:  'logLevel'
      , value:    'WARN'
      , dflt:     'INFO'
      }
    )
  }
}

function optionalSwitchTest({shortKey, longKey, value, dflt}) {
    const suite = { 
      ['should correspond to switch -' + shortKey]: 
      function() {
          var args = runWith(['-s', 'path/to/spec', '-' + shortKey, value])
            ;
          args.should.have.property(longKey,value);
          args.should.have.property(shortKey,value)
      }
    , ['should correspond to switch --' + longKey]: 
      function() {
          var args = runWith(['-s', 'path/to/spec', '--' + longKey, String(value)])
            ;
          args.should.have.property(longKey,value);              
          args.should.have.property(shortKey,value)
          
      }
    }
    
    if (dflt) {
        suite['should default to ' + dflt ] = function() {
            var args = runWith(['-s', 'path/to/spec', ]);
            
            args.should.have.property(longKey, dflt);
            args.should.have.property(shortKey, dflt)
        }
    }
    
    return suite
}

function runWith(argv) {
    runWith.exit = false;
    runWith.logged = []
    return args(
      { argv: ['/patj/to/node', '/path/to/cli'].concat(argv)
      , exit: () => { runWith.exit = true  }
      }
    , (msg) => { runWith.logged.push(msg) }
    )
}
