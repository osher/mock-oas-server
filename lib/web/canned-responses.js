/**
  adapts between web-layer and can-mgr
  holds a request log
 */
module.exports = function cannedResFctry({canMgr, genMgr}) {
    const assing      = Object.assign
    const mapRequest  = require('./request-mapper')
    const sendAs      =
      { text: (res, r) => {
          r.status(res.status || 200)
           .set(res.headers || {})
           .send(res.body)
        }
      , json: (res, r) => {
          r.status(res.status || 200)
           .set(res.headers || { 'content-type' : 'application/json' })
           .json(res.body)
        }
      // TBD: xml, file download, etc...
      }
    let log = []

    canMgr.response.types = Object.keys(sendAs)
    
    return {
      response: (q,r,n) => {
        const request = mapRequest(q)
        const key = 
          { url:    q.originalUrl
          , method: q.method
          , params: request.params
          }
        let source
        const response =
             (source = 'can'      ) && canMgr.response(key)
          || (source = 'generated') && genMgr.response(key)
        
        if (response) {
            log.push({
              request,
              response,
              source
            })
            sendAs[ response.type || 'text' ]( response, r )
        }

        n()
      }
    , set: (q,r,n) => {
        r.json( cannedRes.set(q.body) || { ok: true } )
        log = []
        n()
      }
    , flushLog: (q,r,n) => {
        r.status(
          200
        ).set(
          { 'content-type' : 'application/json'
          }
        ).end(
          JSON.stringify(log)
        )
        n()
      }
    }
    
    function valuesOf(params) {
        return Object
          .keys(params)
          .reduce((o, p) => assign(o, {[p]: parasm[p].value}), {})
    }
}