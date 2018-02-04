/**
  holds the logic of the programmatic responses.
  i.e - accepts directives to responses state machine via 
    descriptors in `set`, and prompts this state machine 
    every time a request is pulled.    
 */
module.exports = (ctx) => {
    validate(ctx)

    const {logger, sway} = ctx
    const assign       = Object.assign
    const log          = logger.of('oas:can-mgr')
    const respDefaults =
      { type:     "text"
      , status:   200
      , headers:  {}
      , body:     ""
      }
    const ops          = opsIndexOf(sway)
    let cans           = ctx.cans
    let types          = { text: true, json: true }

    // enforce validation
    if (cans) {
        const err = set(cans)
        if (err) throw err
    } else { 
        cans = {}
    }

    //types accessor
    /**
     @property
     @example
       canMgr.response.types = ['text', 'json', 'xml']
       canMgr.response.types // ['text', 'json', 'xml']
       types // {text:true, json: true, xml: true}
     */
    Object.defineProperty(response, 'types',
      { set: (arr) => { types = arr.reduce((types, t) => assign(types, {[t]: true}), {}) }
      , get: () => Object.keys(types)
      }
    )
    //cans accessor (tests helper)
    Object.defineProperty(set, 'cans', { get: () => cans })

    return {
      response,
      set
    }

    /**
     finds a canned-response for the given key, or returns null.
     manages the cans magazine, depleting used up cans and cleaning up after them
     
     - cans - a map of operationId => cans-magazine
     - magazine - a list of cans, each may be marked with a filter "lock"
     - can - a holder of a response, with it's response-type, time, and lock filter.
     
     A canned response will be served when:
     - cans[operationId] has a magazine
       AND
     - magazine has a can that EITHER does not have a lock OR request key matches the lock
     
     Emptied cans are popped away from the magazine
     Empty magazines are not discarded (it's just an empty Array...)
     
     @param {object} key - a can opener, describes a request
     @param {string} key.method - the method to find operation by
     @param {string} key.accept - the Accept http header, or *\* when no such header found
     @param {string} key.url - the path to find operation by
     @param {object} key.params
        map of each identified OAS param name and it's actual value
        should be used for responder-matching
     @returns {object} `respDescr = {status, headers, body}` as provided in the matching can
     */
    function response(key) {
        const { operationId: opId } = sway.getOperation(key) || {}
        log.debug('found operation', key, opId)

        const magazine = cans[opId] || []
        const canned = magazine.find(matchFor(key))

        log.debug('found for operationId [%s] canned', opId, canned)
        if (!canned) return null

        //manage canned responses state machine
        if (!--canned.times) cans[opId] = magazine.filter( r => r.times )

        return canned.response
    }

    /**
     Selects the first can in the magazine that is suitable to answer
     the request descriptor in `key`
     @param {object} key
     @param {string} key.url - the path to find operation by
     @param {string} key.method - the method to find operation by
     @param {object} key.params
        map of each identified OAS param name and it's actual value
        should be used for responder-matching
     @returns {object} `respDescr = {status, headers, body}` as provided in the matching can
     */
    function matchFor(key) {
        //TODO: handle request matcher
        return (can) => true
    }
    
    /**
      major concern of this setter is to provide informative directions
      whenever a user tries to set a bad response
      @param {map(<opId, Array<opCan>>} cansByOpId
        an array of structures, each describe canned responses per path/verb
      @returns null on success, else - Errors collection
      @example
        mgr.set(
          { operationId: 
            [ { times:      1
              // TBD: handle params matchers
              //, params:
              //  { 'pathParam':    /foo/
              //  , 'body.foo.bar': {$exists: true}
              //  }
              , response:
                { type:     'json'
                , status:   301
                , headers:  { location: 'http://somewhere/over/the/rainbow' }
                }
              }
            , { times:      Infinity
              , response:
                { type:     'json'
                , status:   200
                , headers:  {}
                , body:     
                  { id: 
                    //TODO: handle dynamic elements in response as f(params)
                    //    '${params.id}'
                          3
                  , and:  'some'
                  , more: 'attributes'
                  , with: { nested: 'data' }
                  } 
                }
              }
            ]
          }
        )
    */
    function set(cansByOpId) {
        const r = Object.keys(cansByOpId).reduce( (r, operationId) => {
            const rawResponders = cansByOpId[operationId]
            
            if ( !Array.isArray(rawResponders)
              || rawResponders.find(d => !d || 'object' != typeof d)
               ) {
                r.rejections.push(
                  { reject:      'responders is not an array of descriptor objects'
                  , operationId
                  }
                )
                return r
            }
            
            const opCans =
              r.cans[ operationId ] =
                rawResponders.map((opDescr) => { 
                  const normalizedOp = assign(
                    opDescr
                  , { times: opDescr == 'Infinity' ? Infinity : opDescr.times || Infinity }
                  , { response: 
                      assign(
                        {}
                      , respDefaults
                      , 'object' == typeof opDescr.response
                          ? opDescr.response 
                          : { body: opDescr.response } 
                      )
                    }
                  )
                  const reject = validateOpCan(normalizedOp, ops[operationId])
                  if (reject) r.rejections.push(
                    { reject
                    , operationId
                    , opDescr
                    }
                  )
                  return normalizedOp
                })
            
            return r
        }, { rejections: [], cans: {} } )
        
        if (r.rejections.length) {
            return assign(
              new Error(
               `Invalid input passed to canMgr.set(..) - no can was set.
                Input is expected to be a map of operationId to Array of response descriptor objects.
                Each descriptor objects should feature the following attributes: 
                 - type:    Mandatory - string of one of the supported response types: ${response.types}
                 - status:  Optional  - integer number a valid http status; between 100 and 599
                 - headers: Optional  - object mapping http-header to their values
                 - body:    Optional  - any value you wish to be sent, according to the response type
               `.replace(/\n                /g,'\n')
              )
            , { rejections: r.rejections }
            )
        }
        
        cans = r.cans
    }
    
    /**
      used internally to validate opCan desdcriptors
      exposed merely for tests
      @internal
      @param {object} opCan - can for a single OAS operationId
      @param {Sway.Operation} op
     */
    function validateOpCan(opCan, op) {
        const resp = opCan.response
        if ('Infinity' === opCan.times) opCan.times = Infinity;

        return 'object' != typeof op             && ("unknown operation")
            || 'number' != typeof opCan.times    && ("descr.times is not a number")
            || !types[ resp.type ]               && ("unsupported response type")
            || httpStatusError(resp.status)
            || httpHeadersError(resp.headers)
       
        function httpStatusError(status) {
            return (  
              'number' != typeof status
            || isNaN(status)
            || status !== Math.round(status)
            || !( 99 < status && status < 600 )
            )                                    && ("provided response.status is not a legal http status")
        }
        
        function httpHeadersError(headers) {
            let bad
            return (
              'object' != typeof headers         && ("provided response.headers is not an object")
            || Object.keys(headers)
                .map(h => typeof headers[h])
                .find(
                  t => t != 'string'
                    && t != 'number'
                    && t != 'boolean'
                )                                && ("provided an http header with a non-scalar value")
            )
        }
    }

    /**
      @private
      @param {sway} sway - See: https://github.com/apigee-127/sway/blob/master/docs/API.md#module_Sway..SwaggerApi
      @returns an object map of operationId -> Operation
     */
    function opsIndexOf(sway) {
        return sway
          .getOperations()
          .reduce( (ops, op) => assign(ops, { [op.operationId] : op } ), {} )
    }

    function validate(ctx) {
        const {logger, sway} = ctx || {}
        let msg =
             !ctx              && "options is not an object"
          || !(  logger       
              && 'function' == typeof logger.of
              )                && "options.logger is missing or is not a logger provider"
          || !( sway 
              && 'function' == typeof sway.getOperations
              && 'function' == typeof sway.getOperation
              )                && "options.sway is missing or not a SwayAPI object"
        
        if(msg) throw new Error(
          `Invalid settings for can-mgr
           Valid settings should incude:
             - logger - implements .of(name), returns log
             - sway   - implements .getOperations(), returns array of operation objects
           Reason:
             ${msg}`.replace(/\n           /g,"\n")
        )
    }
}