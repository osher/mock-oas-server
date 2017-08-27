const EventEmitter = require('events').EventEmitter
const destroyable  = require('server-destroy')
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
    
    const sockets = {}
    let sockId = 0

    return api
    
    function kickServerUp(app) {
        log.info('binding server')
        app.on('error', (err) => api.emit('error', err))
        svr = app.listen(args.port, err =>
          err 
            ? api.emit('fatal', err)
            : api.emit('started', svr.address())
        )
        destroyable(svr)
        
    }
    
    function shutServerDown(cb) {
        log.info('closing web server') 
        if (svr.closing) return
        
        svr.closing++
        svr.destroy(e => cb(e && !e.message.match(/Error: Not running/) && e))
    }
}