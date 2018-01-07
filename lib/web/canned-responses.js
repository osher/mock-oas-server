/**
  adapts between web-layer and can-mgr
  holds a request log
 */
module.exports = function cannedResFctry({canMgr, genMgr, js2xml = require('xml-js').js2xml}) {
    const assing      = Object.assign
    const mapRequest  = require('./request-mapper')
    const sendAs      =
      { text: ({status = 200, headers = {}, body}, res) => {
          res.status(status)
          .set(headers)
          .send(body)
        }
      , json: ({status = 200, headers = {}, body}, res) => {
          res.status(status)
          .set(headers)
          .json(body)
        }
      , xml:  ({status = 200, headers = {}, body, options = { compact: true }}, res) => {
          res.status(status)
          .set(headers)
          .send(js2xml(body, options))
        }
      , pipe: ({status, headers, body: stream}, res) => {
          res.status(status)
          .set(headers)
          
          stream.pipe(res)
        }
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
        n()
      }
    , flushLog: (q,r,n) => {
        r.json(log)
        log = []
        n()
      }
    }
    
    function valuesOf(params) {
        return Object
          .keys(params)
          .reduce((o, p) => assign(o, {[p]: params[p].value}), {})
    }
}