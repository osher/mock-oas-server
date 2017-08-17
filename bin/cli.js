const args    = require('../lib/args')(process, console.log)
const log     = 
  require('../lib/logger')
    .configure(
      { appenders:  { stdout:  { type: "console" } }
      , categories: { default: { appenders: [ 'stdout' ], level: args.logLevel } }
      }
    ).of('oas:cli')
const banners = require('../lib/cli-banners')(log)

banners.hello()
log.debug('accepted args', args);

const svr = require('../lib')({args, log})
  .on('started', address => log.info('server started', address))
  .on('error', banners.error)
  .on('fatal', err => { 
      banners.fatal(err)
      process.exit(1)
  })


process.on('SIGINT', shutdown('SIGINT'))
process.on('SIGTERM', shutdown('SIGTERM'))

function shutdown(signal) {
  return function handleSignal(err) {
      if (process.shuttingDown) return
      
      banners.bye(signal)
      svr.close((err) => {
          log[err ? 'error' : 'info']('server shutdown ', err || 'OK')
      })
      setTimeout(
        () => {
          log.warn('server did not close timely - I had to kick it :(') 
          process.exit(1)
        }
      , args.shutdownGrace
      ).unref()
  }
}
