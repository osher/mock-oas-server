const debug = require('debug')('oas:gen-mgr')
module.exports = ({sway}) => {
    return { response }
    
    /**
     @param {object} key
     @param {string} key.url - the path to find operation by
     @param {string} key.method - the method to find operation by
     */
    function response (key) {

        const op = sway.getOperation(key)
        debug('found operation', key, op && op.operationId)
        if (!op) return null
        
        const okResponse = op.getResponses().find(
          ({statusCode}) => {
            const range = Math.floor( statusCode / 100 )
            return 3 == range || 2 == range
          }
        )
        
        if (!okResponse) return (
          { status:  200
          , headers: { 'content-type' : 'application/json' }
          , body:    { ok: true }
          }
        )
        debug('found ok response', okResponse.statusCode)

        return (
          { type:    'json'
          , status:  okResponse.statusCode || '200'
          , headers: 
            // TODO: generate headers as function of ACCEPT and produces
            { 'content-type' : 'application/json' }
          , body:    okResponse.getSample()
          }
        )
    }
}