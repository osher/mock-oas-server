module.exports = (q) => (
  { httpVersion:  q.httpVersion
  , method:       q.method
  , originalUrl:  q.originalUrl
  , url:          q.url
  , baseUrl:      q.baseUrl 
  , headers:      q.headers
  , params:       q.params
  , query:        q.query
  , body:         q.body
  }
)