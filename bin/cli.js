var args    = require('../lib/args')(process, console)
  , log     = require('../lib/logger')
    .configure(
      { appenders:
        { stdout:  { type: "console" } }
      , categories: {
          default: { appenders: [ 'stdout' ], level: 'info' }
        }
      }
    ).of('oas:cli')
  , figlet  = require('figlet')
  ;

log.info('\n%s\nOpen API Server Mocker', figlet.textSync('OASM'));
log.debug('accepted args', args);

require('../lib')(args, function(err) {
    log[ /* istanbul ignore next */ err ? "error" : "info"](err || "Ok :)")
});