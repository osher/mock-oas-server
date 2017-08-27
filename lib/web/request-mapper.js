const assign = Object.assign

module.exports = (q) => (
  { httpVersion:  q.httpVersion
  , method:       q.method
  , url:          q.url
  , originalUrl:  q.originalUrl
  , baseUrl:      q.baseUrl 
  , headers:      q.headers
  , params:       q.params
  , query:        q.query
  , body:         q.body
  , oasParams:    q.swagger ? valuesOf(q.swagger.params) : undefined
  }
)
   
function valuesOf(params) {
    return Object
      .keys(params)
      .reduce((o, p) => assign(o, {[p]: params[p].value}), {})
}