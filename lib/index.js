const EventEmitter = require('events').EventEmitter
const svrPromise   = require('./web/server')

module.exports = serverFactory

function serverFactory(ctx) {
    const {args} = ctx
    const log = ctx.logger.of('oas:main')
    const api = new EventEmitter()
    let svr

    api.close = shutServerDown

    log.debug('setting up server')
    svrPromise(ctx)
      .then(kickServerUp)
      .catch(err => api.emit('fatal', err))
    
    return api
    
    function kickServerUp(app) {
        log.info('binding server')
        app.on('error', (err) => api.emit('error', err))
        svr = app.listen(args.port, err =>
          err 
            ? api.emit('fatal', err)
            : api.emit('started', svr.address())
        )
    }
    
    function shutServerDown(cb) {
        log.info('closing web server') 
        svr.close(e => cb(e && e.message !== 'Error: Not running' && e))
    }
}