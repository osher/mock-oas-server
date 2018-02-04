module.exports = ({sway, logger}) => {
    const log = logger.of('oas:can-mgr')
    return { response }
    
    /**
     @param {object} key
     @param {string} key.url - the path to find operation by
     @param {string} key.method - the method to find operation by
     */
    function response (key) {

        const op = sway.getOperation(key)
        log.debug('operation', key, op && op.operationId || 'not in oas-speC')
        if (!op) return null
        
        const okResponse = op.getResponses().find(
          ({statusCode}) => {
            const range = Math.floor( statusCode / 100 )
            return 3 == range || 2 == range || statusCode == 'success'
          }
        )
        
        if (!okResponse) return (
          { status:  200
          , headers: { 'content-type' : 'application/json' }
          , body:    { ok: true }
          }
        )
        log.info('generated response operation: %s, statusCode:', op.operationId, okResponse.statusCode)

        return (
          { type:    'json'
          , status:  okResponse.statusCode
          , headers: 
            // TODO: generate headers as function of ACCEPT and produces
            { 'content-type' : 'application/json' }
          , body:    okResponse.getSample()
          }
        )
    }
}