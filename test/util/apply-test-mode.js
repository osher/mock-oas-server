var config = 
    { appenders   :
      { stdout:
        { type    : "console" }
      }
    , categories: {
        default: { appenders: ['stdout'], level: 'WARN' }
      }
    }
  ;

require('../../lib/logger')
  .configure( config )
  .of("test-mode")
  .warn("test mode applied");