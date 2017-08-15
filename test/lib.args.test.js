var fs    = require('fs')
  , path  = require('path')
  , args  = require('../lib/args')
  ;
module.exports = 
{ "lib/args" : 
  { ".spec" : 
    { "should correspond to switch -s" :
      function() {
          var value = "TEST" + Math.random()
            , args = runWith(["-s", value])
            ;
          args.should.have.property('spec',value)
          args.should.have.property('s',value)
          runWith.exit.should.be.False()
      }
    , "should correspond to switch --spec" :
      function() {
          var value = "TEST" + Math.random()
            , args = runWith(["--spec", value])
            ;
          args.should.have.property('spec',value)
          args.should.have.property('s',value)
          runWith.exit.should.be.False()
      }
    , "should be a mandatory argument" :
      function() {
          var value = process.cwd()
            , args = runWith([])
            ;
          runWith.exit.should.be.True()
          runWith.logged.length.should.be.greaterThan(0)
      }
    }
  , ".port" : 
    { "should correspond to switch -p" : 
      function() {
          var value = parseInt( Math.random() * 10000)
            , args = runWith(["-s", "path/to/spec", "-p", value])
            ;
          args.should.have.property('port',value);
          args.should.have.property('p',value)
      }
    , "should correspond to switch --port" : 
      function() {
          var value = "TEST" + Math.random()
            , args = runWith(["-s", "path/to/spec", "--port", value])
            ;
          args.should.have.property('port',value);              
          args.should.have.property('p',value)
          
      }    
    }
  , ".logLevel" : 
    { "should correspond to switch -l" : 
      function() {
          var value = "WARN"
            , args = runWith(["-s", "path/to/spec", "-l", value])
            ;
          args.should.have.property('logLevel',value);
          args.should.have.property('l',value)
      }    
    , "should correspond to switch --logLevel" : 
      function() {
          var value = "WARN"
            , args = runWith(["-s", "path/to/spec", "--logLevel", value])
            ;
          args.should.have.property('logLevel',value);
          args.should.have.property('l',value)
      }    
    , "should default to INFO" : 
      function() {
          var args = runWith(["-s", "path/to/spec", ]);
          
          args.should.have.property('logLevel',"INFO");
          args.should.have.property('l',"INFO")
      }
    }
  }
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
