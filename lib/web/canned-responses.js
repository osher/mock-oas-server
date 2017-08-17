/**
  adapts between web-layer and can-mgr
  holds a request log
 */
module.exports = function cannedResFctry({canMgr, genMgr}) {
    const mapRequest = require('./request-mapper')
    const sendAs = {
      text: (res, r) => {
        r.status(res.status || 200)
         .set(res.headers || {})
         .send(res.body)
      }
    , json: (res, r) => {
        r.status(res.status || 200)
         .set(res.headers || { 'content-type' : 'application/json' })
         .json(res.body)
      }
    }
    let log = []

    return {
      response: (q,r,n) => {
        const response =
             canMgr.response(q.path, q.method)
          || genMgr.response(q)
        
        if (response) {
            log.push({
              request: mapRequest(q),
              response
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
}