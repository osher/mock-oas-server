module.exports = ({sway}) => {
  return { response }
  
  function response (path, verb) {
      const op = sway.gerOperation(path, verb)
      if (!op) return
      
      const okResponse = op.getResponses().find(
        ({statusCode}) => {
          const range = statusCode / 100
          return 2 == Math.round(range) 
              || 3 == Math.round(range)
        }
      ) || op.getResponse('success')
      
      if (!okResponse) return (
        { status:  200
        , headers: { 'content-type' : 'application/json' }
        , body:    { ok: true }
        }
      )
      
      // TODO: generate this part based on `okResponse`
      return (
        { status:  200
        , headers: { 'content-type' : 'application/json' }
        , body:    { ok: true }
        }
      )
  }
}