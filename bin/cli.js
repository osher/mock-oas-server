const args    = require('../lib/args')(process, console.log)
const logger  = require('../lib/logger')
const log     =
  logger
    .configure(
      { appenders:  { stdout:  { type: "console" } }
      , categories: { default: { appenders: [ 'stdout' ], level: args.logLevel } }
      }
    ).of('oas:cli')
const banners = require('../lib/cli-banners')(log)

banners.hello()
log.debug('accepted args', args);

const svr = require('../lib')({args, logger})
  .on('started', banners.up)
  .on('error', banners.error)
  .on('fatal', shutdown('FATAL', 'fatal'))

process.on('SIGINT', shutdown('SIGINT'))
process.on('SIGTERM', shutdown('SIGTERM'))
process.on('message', m => 'IPCTERM' == m && shutdown('SIGINT')())

function shutdown(signal, banner = 'bye') {
  return function handleSignal(err) {
      banners[banner](signal)
      svr.close((err) => {
          log[err ? /* istanbul ignore next */ 'error' : 'info']('server shutdown ', err || 'OK')
          process.exit()
      })
      const timeout = setTimeout(
        () => {
          /* istanbul ignore next */
          log.warn('server did not close timely - I had to kick it :(')
          /* istanbul ignore next */
          process.exit(1)
        }
      , args.shutdownGrace
      ).unref()
  }
}
